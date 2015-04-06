Aria.tplScriptDefinition({
    $classpath: 'modules.view.merci.segments.servicing.subModules.timetable.templates.MTimeTableQueryScript',
    $dependencies: ['modules.view.merci.common.utils.URLManager', 'modules.view.merci.common.utils.MCommonScript', 'modules.view.merci.common.utils.MerciGA'],
    $constructor: function() {
        pageTimeTable = this;
        this.__ga = modules.view.merci.common.utils.MerciGA;
        this.__merciFunc = modules.view.merci.common.utils.MCommonScript;     
    },
    $destructor: function() {
        // release memory
        pageTimeTable = null;
    },
    $prototype: {

        $dataReady: function() {
            if (this.moduleCtrl.getModuleData().servicing == null || this.moduleCtrl.getModuleData().servicing.MTT_BSR_A == null) {
                var actionName = 'MTimeTableSearch.action';
                var params = "result=json";
                var defParams = true;
                var request = {
                    action: actionName,
                    parameters: params,
                    defaultParams: defParams,
                    method: 'POST',
                    expectedResponseType: 'json',
                    cb: {
                        fn: this.__onTimeTableQueryCallback,
                        args: params,
                        scope: this
                    }
                };

                modules.view.merci.common.utils.URLManager.makeServerRequest(request, false);
            } else {
                this.printUI = true;
                var base = modules.view.merci.common.utils.URLManager.getBaseParams();
                pageTimeTable.siteParams = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.siteParam;

                // google analytics
                this.__ga.trackPage({
                    domain: pageTimeTable.siteParams.siteGADomain,
                    account: pageTimeTable.siteParams.siteGAAccount,
                    gaEnabled: pageTimeTable.siteParams.siteGAEnable,
                    page: 'TimeTable Search?wt_market=' + ((base[13] != null) ? base[13] : '') +
                        '&wt_language=' + base[12] + '&wt_officeid=' + pageTimeTable.siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
                    GTMPage: 'TimeTable Search?wt_market=' + ((base[13] != null) ? base[13] : '') +
                        '&wt_language=' + base[12] + '&wt_officeid=' + pageTimeTable.siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
                });
                
                if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.requestParam.errors)) {
                    this.data.errors = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.requestParam.errors;
                    aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
                }
            }
        },
        __onTimeTableQueryCallback: function(response, inputParams) {
            if (response.responseJSON != null && response.responseJSON.data != null && response.responseJSON.data.servicing != null) {
                var json = this.moduleCtrl.getModuleData();
                if (json.servicing == null) {
                    json.servicing = {};
                }
                json.servicing.MTT_BSR_A = response.responseJSON.data.servicing.MTT_BSR_A;
                json.header = response.responseJSON.data.headerInfo;
                var nextPage = response.responseJSON.homePageId;
                var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
                if (dataId == 'MError_A') {
                    this.moduleCtrl.navigate(null, nextPage);
                } else {
                    this.printUI = true;
                    this.$refresh({
                        section: 'timeTablePage'
                    });
                    var base = modules.view.merci.common.utils.URLManager.getBaseParams();
                    var siteParams = response.responseJSON.data.servicing.MTT_BSR_A.siteParam;
                    
                    // google analytics
                    this.__ga.trackPage({
                        domain: siteParams.siteGADomain,
                        account: siteParams.siteGAAccount,
                        gaEnabled: siteParams.siteGAEnable,
                        page: 'TimeTable Search?wt_market=' + ((base[13] != null) ? base[13] : '') +
                            '&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11],
                        GTMPage: 'TimeTable Search?wt_market=' + ((base[13] != null) ? base[13] : '') +
                            '&wt_language=' + base[12] + '&wt_officeid=' + siteParams.siteOfficeID + '&wt_sitecode=' + base[11]
                    });
					
                    if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(response.responseJSON.data.servicing.MTT_BSR_A.requestParam.errors)) {
                        this.data.errors = response.responseJSON.data.servicing.MTT_BSR_A.requestParam.errors;
                        aria.utils.Json.setValue(this.data, 'errorOccured', !this.data.errorOccured);
                    }
                }
            }
        },

        $displayReady: function() {
            if (this.moduleCtrl.getModuleData().servicing != null && this.moduleCtrl.getModuleData().servicing.MTT_BSR_A != null) {
                $('body').addClass('timetable shtm sear');
                if(this.data.errors){
                    this.resetDate();
                }
                //this.__createAutoCompleteInput();
                var timeTableData=this;
                $('.ui-datepicker-trigger').click(function() {
                    $('#timeTable').hide();
                    if(timeTableData.__merciFunc.isRequestFromApps()==false){
                        $('.banner').addClass('hideThis');
                    }
                    $('#ui-datepicker-div').show();
                });
            }
        },
        $viewReady: function() {
            $('body').attr('id', 'timetable');
            this.resetDate();
            if (this.moduleCtrl.getModuleData().servicing != null && this.moduleCtrl.getModuleData().servicing.MTT_BSR_A != null) {
                var header = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.headerInfo;
                var siteParams = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.siteParam;
                var rqstParams = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.requestParam;
                var labels = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.labels;
                if (this.__merciFunc.booleanValue(siteParams.enableLoyalty) == true && this.__merciFunc.booleanValue(rqstParams.IS_USER_LOGGED_IN) == true) {
                    var bp = modules.view.merci.common.utils.URLManager.getBaseParams();
                    var loyaltyInfoJson = {
                        loyaltyLabels: labels.loyaltyLabels,
                        airline: bp[16],
                        miles: bp[17],
                        tier: bp[18],
                        title: bp[19],
                        firstName: bp[20],
                        lastName: bp[21],
                        programmeNo: bp[22]
                    };
                }
                if (header != null) {
                    this.moduleCtrl.setHeaderInfo({
                        title: header.title,
                        bannerHtmlL: header.bannerHtml,
                        homePageURL: header.homeURL,
                        showButton: true,
                        companyName: siteParams.sitePLCompanyName,
                        loyaltyInfoBanner: loyaltyInfoJson
                    });
                } else {
                    this.moduleCtrl.setHeaderInfo({
                        showButton: true,
                        companyName: siteParams.sitePLCompanyName,
                        loyaltyInfoBanner: loyaltyInfoJson
                    });
                }
            }
           $('.ui-datepicker-trigger').click(function() {
                $('#timeTable').hide();
                $('#ui-datepicker-div').show();
                if(pageTimeTable.__merciFunc.isRequestFromApps()==false){
                    $('.banner').addClass('hideThis');
                }
            });                
            this.prepopulateValues();
			
			if (typeof genericScript == 'function') {
					genericScript({
						tpl:"MTimeTableQuery",
						data:this.data
					});
			}

        },

        $afterRefresh: function() {
            this.data.errors = new Array();
        },

        smartSelect: function(selectedDest) {

            var destExpandedList = new Array();
            var smartContent = JSON.parse(this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.requestParam.smartDropDownContent);
            var selctSmartDest = selectedDest.toUpperCase();
            var destinations = smartContent.routes['out'][selctSmartDest];

            if (destinations != null) {
                for (var i = 0; i < destinations.length; i++) {
                    destExpandedList[i] = smartContent.labels[destinations[i]];
                }
                return destExpandedList;
            } else {
                return [];
            }
        },


        createAutocompleteSourceAria: function(listItem, isFirstField, evt) {
            var autoCompleteSource = [];
            if (typeof(customerAppData) != 'undefined' && (pageTimeTable.__merciFunc.isRequestFromApps() == true || customerAppData.isTestEnvironment) && (typeof customerAppData.departureCityList != "undefined" ) && customerAppData.departureCityList.length > 0) {
                if (isFirstField == true) {
                    autoCompleteSource = customerAppData.departureCityList;
                } else {
                    if (customerAppData.destinationCityList.length > 0) {
                        autoCompleteSource = customerAppData.destinationCityList;
                    } else {
                        autoCompleteSource = customerAppData.departureCityList;
                    }
                }
            } else {

                var TTJson = {};
                var respArr = [];

                var response = this.__merciFunc.getStoredItem('TTJson');
                if (response != null) {
                    respArr = JSON.parse(response);
                }


                for (var j = 0; j < listItem.length; j++) {
                    var temp = listItem[j];
                    var keyFound = false;
                    if ((pageTimeTable.siteParams.siteRetainSearch == "TRUE") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {
                        for (var k = 0; k < respArr.length; k++) {
                            if (isFirstField == true && temp[0] == respArr[k]) {
                                keyFound = true;
                                break;
                            }
                        }
                    }
                    var json = {
                        label: temp[1],
                        code: temp[1],
                        image: {
                            show: keyFound,
                            css: 'fave'
                        }
                    }

                    if (keyFound) {
                        autoCompleteSource.unshift(json);
                    } else {
                        autoCompleteSource.push(json);
                    }
                }
            }
            return autoCompleteSource;
        },


        selectFromARIA: function(evt, ui) {

            if (typeof(customerAppData) != 'undefined' && (pageTimeTable.__merciFunc.isRequestFromApps() == true || customerAppData.isTestEnvironment) && (typeof customerAppData.departureCityList != "undefined" ) && customerAppData.departureCityList.length > 0 && typeof(createDestinationAirportList) != 'undefined') {
                var code = ui.suggestion.code;
                console.log('SOURCE selected:' + code);
                if (code.length == 3) {
                    createDestinationAirportList(code);
                }
                this.$refresh({
                    section: 'createDestinationFeild'
                });

                if ((pageTimeTable.siteParams.siteRetainSearch == "TRUE") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {

                    var today = new Date();
                    var setDt1 = new Date();
                    var setDt2 = new Date();
                    if (code[0].length != 3) {
                        code[0] = code[0].substring(code[0].length - 3, code[0].length);
                    }
                    var entry = {};

                    var response = pageTimeTable.__merciFunc.getStoredItem("TTFrom:" + code[0]);
                    if (response != null && response != "") {
                        entry = JSON.parse(response);
                    }
                    if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(entry)) {
                        document.getElementById('E_LOCATION_1_TT').value = entry.to;
                        document.getElementById(entry.trip_type).checked = true
                        pageTimeTable.toggleReturnJourney();
                        setDt1.setFullYear(entry.dep_date.substring(0, 4), entry.dep_date.substring(4, 6) - 1, entry.dep_date.substring(6, entry.dep_date.length));
                        setDt2.setFullYear(entry.ret_date.substring(0, 4), entry.ret_date.substring(4, 6) - 1, entry.ret_date.substring(6, entry.ret_date.length));
                        if (pageTimeTable.siteParams.showNewDatePicker != "TRUE") {
                            pageTimeTable.setDatesOld(setDt1, 'Date', 'Month', 'Year', entry.dep_date, today);
                            pageTimeTable.setDatesOld(setDt2, 'date_e', 'month_e', 'year_e', entry.ret_date, today);
                        } else {
                            pageTimeTable.setDatesNew(setDt1, 'Date', 'Month', 'Year', 'datePickTimeTableF', today, 'depTTdate');
                            pageTimeTable.setDatesNew(setDt2, 'date_e', 'month_e', 'year_e', 'datePickTimeTableT', today, 'retTTdate');
                        }
                    }
                }
            } else {


                if (pageTimeTable.siteParams.siteAllowSmartLoc == 'TRUE') {
                    var selectedAirportName = ui.suggestion.code.split("(");
                    var selectedAirportCode = selectedAirportName[1].split(")");
                    if (selectedAirportCode[0].length != 3) {
                        selectedAirportCode[0] = selectedAirportCode[0].substring(selectedAirportCode[0].length - 3, selectedAirportCode[0].length);
                    }
                }

                if ((pageTimeTable.siteParams.siteRetainSearch == "TRUE") && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {
                    var name = ui.suggestion.code.split("(");
                    var code = name[1].split(")");
                    var today = new Date();
                    var setDt1 = new Date();
                    var setDt2 = new Date();
                    if (code[0].length != 3) {
                        code[0] = code[0].substring(code[0].length - 3, code[0].length);
                    }
                    var entry = {};

                    var response = pageTimeTable.__merciFunc.getStoredItem("TTFrom:" + code[0]);
                    if (response != null && response != "") {
                        entry = JSON.parse(response);
                    }
                    if (!modules.view.merci.common.utils.MCommonScript.isEmptyObject(entry)) {
                        document.getElementById('E_LOCATION_1_TT').value = entry.to;
                        document.getElementById(entry.trip_type).checked = true
                        pageTimeTable.toggleReturnJourney();
                        setDt1.setFullYear(entry.dep_date.substring(0, 4), entry.dep_date.substring(4, 6) - 1, entry.dep_date.substring(6, entry.dep_date.length));
                        setDt2.setFullYear(entry.ret_date.substring(0, 4), entry.ret_date.substring(4, 6) - 1, entry.ret_date.substring(6, entry.ret_date.length));
                        if (pageTimeTable.siteParams.showNewDatePicker != "TRUE") {
                            pageTimeTable.setDatesOld(setDt1, 'Date', 'Month', 'Year', entry.dep_date, today);
                            pageTimeTable.setDatesOld(setDt2, 'date_e', 'month_e', 'year_e', entry.ret_date, today);
                        } else {
                            pageTimeTable.setDatesNew(setDt1, 'Date', 'Month', 'Year', 'datePickTimeTableF', today, 'depTTdate');
                            pageTimeTable.setDatesNew(setDt2, 'date_e', 'month_e', 'year_e', 'datePickTimeTableT', today, 'retTTdate');
                        }
                    }
                }

            }
        },

        toggleReturnJourney: function() {
            var retJourney = document.getElementById('retTTJourney');
            var radio = document.getElementById("TTOneWay");
            if (radio.checked)
                this.__merciFunc.addClass(retJourney, "displayNone");
            else
                this.__merciFunc.removeClass(retJourney, "displayNone");

        },

        radioOnewaySelect: function() {
            document.querySelector(".is-tab#TTOneWay").checked = true;
            this.toggleReturnJourney();
        },
        radioRoundSelect: function() {
            document.querySelector(".is-tab#TTroundTrip").checked = true;
            this.toggleReturnJourney();
        },



        setDatesNew: function(setDt, day, month, yr, picker, today, route) {
            var depdayId = document.getElementById(day);
            var depmonthId = document.getElementById(month);
            var depyear = document.getElementById(yr);
            if (setDt > today) {
                $("#" + picker).datepicker('setDate', setDt);
            } else {
                $("#" + picker).datepicker('setDate', new Date());
            }
            depdayId.value = $.datepicker.formatDate('dd', $("#" + picker).datepicker('getDate'));;
            depmonthId.value = $.datepicker.formatDate('mm', $("#" + picker).datepicker('getDate'));
            var month1 = $.datepicker.formatDate('M', $("#" + picker).datepicker('getDate'));
            var year1 = $.datepicker.formatDate('yy', $("#" + picker).datepicker('getDate'));
            $("#" + route).html("<time>" + month1 + " " + depdayId.value + " , " + year1 + "</time>");
        },

        setDatesOld: function(setDt, day, month, yr, dt, today) {
            if (setDt > today) {
                $("#" + day + " option[value='" + dt.substring(6, dt.length) + "']").attr('selected', true);
                $("#" + month + " option[value='" + dt.substring(4, 6) + "']").attr('selected', true);
                $("#" + yr + " option[value='" + dt.substring(0, 4) + "']").attr('selected', true);
            } else {
                $("#" + day + " option[value='" + today.getDate() + "']").attr('selected', true);
                var m1 = today.getMonth() + 1;
                if (m1 < 10) {
                    m1 = "0" + m1;
                }
                $("#" + month + " option[value='" + m1 + "']").attr('selected', true);
                $("#" + yr + " option[value='" + today.getFullYear() + "']").attr('selected', true);
            }
        },

        resetDate: function() {


            this.createDatePicker();
            var showNewDtPicker = false;
            if (this.moduleCtrl.getModuleData().servicing.MTT_BSR_A != undefined) {
                showNewDtPicker = pageTimeTable.siteParams.showNewDatePicker;
            }
            if (showNewDtPicker == 'TRUE') {
                var a = $('.ui-datepicker-trigger')[0];
                
                $(a).attr("id", "depTTdate");
                var defaultDay1 = $.datepicker.formatDate('dd', $("#datePickTimeTableF").datepicker('getDate'));
                var defaultMonth1 = $.datepicker.formatDate('M', $("#datePickTimeTableF").datepicker('getDate'));
                var defaultYear1 = $.datepicker.formatDate('yy', $("#datePickTimeTableF").datepicker('getDate'));
                var defaultmonthinNo1 = $.datepicker.formatDate('mm', $("#datePickTimeTableF").datepicker('getDate'));
                $("#depTTdate").html("<time>" + defaultMonth1 + " " + defaultDay1 + " , " + defaultYear1 + "</time>");
                $("#depTTdate").attr("monindex", defaultmonthinNo1 + defaultYear1);
                $("#depTTdate").attr("day1", defaultDay1)
                if (this.moduleCtrl.getValuefromStorage("defaultMonIndex1") == undefined || this.moduleCtrl.getValuefromStorage("defaultDay1" == undefined)) {
                    this.moduleCtrl.setValueforStorage(defaultmonthinNo1 + defaultYear1, "defaultMonIndex1");
                    this.moduleCtrl.setValueforStorage(defaultDay1, "defaultDay1");
                }
                
                var b = $('.ui-datepicker-trigger')[1];
                
                $(b).attr("id", "retTTdate");
                var defaultDay2 = $.datepicker.formatDate('dd', $("#datePickTimeTableT").datepicker('getDate'));
                var defaultMonth2 = $.datepicker.formatDate('M', $("#datePickTimeTableT").datepicker('getDate'));
                var defaultYear2 = $.datepicker.formatDate('yy', $("#datePickTimeTableT").datepicker('getDate'));
                var defaultmonthinNo2 = $.datepicker.formatDate('mm', $("#datePickTimeTableT").datepicker('getDate'));
                $("#retTTdate").html("<time>" + defaultMonth2 + " " + defaultDay2 + " , " + defaultYear2 + "</time>");
                $("#retTTdate").attr("monindex", defaultmonthinNo2 + defaultYear2);
                $("#retTTdate").attr("day2", defaultDay2);
                if (this.moduleCtrl.getValuefromStorage("defaultMonIndex2") == undefined || this.moduleCtrl.getValuefromStorage("defaultDay2") == undefined) {
                    this.moduleCtrl.setValueforStorage(defaultmonthinNo2 + defaultYear2, "defaultMonIndex2");
                    this.moduleCtrl.setValueforStorage(defaultDay2, "defaultDay2");
                }
            } else {
                var day1 = $.datepicker.formatDate('dd', $("#datePickTimeTableF").datepicker('getDate'));
                var month1 = $.datepicker.formatDate('mm', $("#datePickTimeTableF").datepicker('getDate'));
                var year1 = $.datepicker.formatDate('yy', $("#datePickTimeTableF").datepicker('getDate'));

                $("#Date option[value=" + day1 + "]").prop('selected', true);
                $("#Month option[value=" + month1 + "]").prop('selected', true);
                $("#Year option[value=" + year1 + "]").prop('selected', true);

                var day2 = $.datepicker.formatDate('dd', $("#datePickTimeTableT").datepicker('getDate'));
                var month2 = $.datepicker.formatDate('mm', $("#datePickTimeTableT").datepicker('getDate'));
                $("#date_e option[value=" + day2 + "]").prop('selected', true);
                $("#month_e option[value=" + month2 + "]").prop('selected', true);
                var year2 = $.datepicker.formatDate('yy', $("#datePickTimeTableF").datepicker('getDate'));
                $("#year_e option[value=" + year1 + "]").prop('selected', true);



            }



        },

        createDatePicker: function() {
            var _this = this;
            var showNewDtPicker = pageTimeTable.siteParams.showNewDatePicker;
            var buttonImgOnly = false;
            var buttonImagePath = modules.view.merci.common.utils.MCommonScript.getImgLinkURL("calTrans.png");
            var return_day_range = pageTimeTable.siteParams.return_day_range;
            var returnDate = parseInt(return_day_range, 10);
            if (showNewDtPicker != 'TRUE') {
                buttonImgOnly = true;
            }
            $('#datePickTimeTableF').datepicker({

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
                    var day1 = $.datepicker.formatDate('dd', $("#datePickTimeTableF").datepicker('getDate'));
                    if (showNewDtPicker != 'TRUE') {
                        var month1 = $.datepicker.formatDate('mm', $("#datePickTimeTableF").datepicker('getDate'));
                        $("#Date option[value=" + day1 + "]").attr('selected', 'selected');
                        $("#Month option[value=" + month1 + "]").attr('selected', 'selected');
                        var year1 = $.datepicker.formatDate('yy', $("#datePickTimeTableF").datepicker('getDate'));
                        $("#Year option[value=" + year1 + "]").attr('selected', 'selected');
                    } else {
                        var month1 = $.datepicker.formatDate('M', $("#datePickTimeTableF").datepicker('getDate'));
                        var year1 = $.datepicker.formatDate('yy', $("#datePickTimeTableF").datepicker('getDate'));
                        var monthinNo = $.datepicker.formatDate('mm', $("#datePickTimeTableF").datepicker('getDate'));
                        $("#depTTdate").html("<time>" + month1 + " " + day1 + " , " + year1 + "</time>");
                        $("#depTTdate").attr("monindex", monthinNo + year1);
                        $("#depTTdate").attr("day1", day1);
                        $("#depTTdate").attr("day1", day1);
                        $("#Day1").val(day1);
                        $("#B_Day").val(day1);
                        $("#Month1").val(year1 + monthinNo);

                        var buffer0 = "";
                        var mon_conv = monthinNo + 1;
                        if (monthinNo < 10)
                            buffer0 = "0";
                        var date_combined = year1.concat(monthinNo, day1, "0000");
                        $("#B_DATE").val(date_combined);

                        $("#Date").val(day1);
                        $("#Month").val(monthinNo);
                        $("#Year").val(year1);

                        var fromDate = $("#datePickTimeTableF").datepicker('getDate');
                        var offSetDate = new Date(fromDate.setDate(fromDate.getDate() + returnDate));
                        $("#datePickTimeTableT").datepicker('setDate', offSetDate);
                        var monthRet = $.datepicker.formatDate('M', $("#datePickTimeTableT").datepicker('getDate'));
                        var yearRet = $.datepicker.formatDate('yy', $("#datePickTimeTableT").datepicker('getDate'));
                        $("#retTTdate").html("<time>" + monthRet + " " + offSetDate.getDate() + " , " + yearRet + "</time>");
                        var dayRet = $.datepicker.formatDate('dd', $("#datePickTimeTableT").datepicker('getDate'));
                        var month2inNo = $.datepicker.formatDate('mm', $("#datePickTimeTableT").datepicker('getDate'));
                        $("#retTTdate").attr("monindex", month2inNo + yearRet);
                        $("#retTTdate").attr("day2", dayRet);
                    }

                    $('#timeTable').show();
                    $('.banner').removeClass('hideThis');
                    $('#ui-datepicker-div').hide();

                },
                onClose: function() {
                    $('#timeTable').show();
                    $('.banner').removeClass('hideThis');
                    $('#ui-datepicker-div').hide();
                }
            });
			
			// PTR 09331655 [Medium]: MeRCI R22 : PROD: TAB : SearchPage : Cal po-up retains old language | iPAD
			// localization fix
            var language = 'en';
            if (aria.core.environment.Environment.getLanguage() != null) {
                language = aria.core.environment.Environment.getLanguage();
                if (language.indexOf('_') !== -1) {
                    language = language.substring(0, language.indexOf('_'));
                }
            } 

            $('#datePickTimeTableF').datepicker('option', $.datepicker.regional[ language || navigator.language || navigator.userLanguage || 'en' ]);
			
            $('#datePickTimeTableT').datepicker({

                showOn: "button",
                buttonImage: buttonImagePath,
                buttonImageOnly: buttonImgOnly,
                dateFormat: 'yy-mm-dd',
                inline: true,
                changeMonth: true,
                changeYear: true,
                minDate: 0,
                maxDate: "+364D",
                defaultDate: +returnDate,
                firstDay: 1,
                showButtonPanel: true,
                buttonText: "",
                onSelect: function() {
                    var day2 = $.datepicker.formatDate('dd', $("#datePickTimeTableT").datepicker('getDate'));
                    if (showNewDtPicker != 'TRUE') {
                        var month2 = $.datepicker.formatDate('mm', $("#datePickTimeTableT").datepicker('getDate'));
                        $("#date_e option[value=" + day2 + "]").attr('selected', 'selected');
                        $("#month_e option[value=" + month2 + "]").attr('selected', 'selected');
                        var year2 = $.datepicker.formatDate('yy', $("#datePickTimeTableF").datepicker('getDate'));
                        $("#year_e option[value=" + year2 + "]").attr('selected', 'selected');
                    } else {
                        var month2 = $.datepicker.formatDate('M', $("#datePickTimeTableT").datepicker('getDate'));
                        var year2 = $.datepicker.formatDate('yy', $("#datePickTimeTableT").datepicker('getDate'));
                        var monthinNo = $.datepicker.formatDate('mm', $("#datePickTimeTableT").datepicker('getDate'));
                        $("#retTTdate").html("<time>" + month2 + " " + day2 + " , " + year2 + "</time>");
                        $("#retTTdate").attr("monindex", monthinNo + year2);
                        $("#retTTdate").attr("day2", day2);
                        $("#Day2").val(day2);
                        $("#E_Day").val(day2);
                        $("#Month2").val(year2 + monthinNo);

                        var buffer0 = "";
                        if (monthinNo < 10)
                            buffer0 = "0";
                        var date_combined = year2.concat(monthinNo, day2, "0000");
                        $("#E_DATE").val(date_combined);

                        $("#date_e").val(day2);
                        $("#month_e").val(monthinNo);
                        $("#year_e").val(year2);
                    }
                    $('#timeTable').show();
                    $('.banner').removeClass('hideThis');
                    $('#ui-datepicker-div').hide();

                },
                onClose: function() {
                    $('#timeTable').show();
                    $('.banner').removeClass('hideThis');
                    $('#ui-datepicker-div').hide();
                }
            });
			
			// PTR 09331655 [Medium]: MeRCI R22 : PROD: TAB : SearchPage : Cal po-up retains old language | iPAD
			// localization fix
			$('#datePickTimeTableT').datepicker('option', $.datepicker.regional[ language || navigator.language || navigator.userLanguage || 'en' ]);
			
			
            if ($("#retTTdate").val() == null && $("#depTTdate").val() == null) {

                var storedDay1 = this.__merciFunc.getStoredItem('Date');
                var storedMonth1 = this.__merciFunc.getStoredItem('Month');
                var storedYear1 = this.__merciFunc.getStoredItem('Year');
                if (storedDay1 != null && storedMonth1 != null && storedYear1 != null) {
                    var offSetDate = new Date(storedMonth1 + "/" + storedDay1 + "/" + storedYear1);
                } else {
                    var offSetDate = new Date();

                }

                $("#datePickTimeTableF").datepicker('setDate', offSetDate);

                var storedDay2 = this.__merciFunc.getStoredItem('date_e');
                var storedMonth2 = this.__merciFunc.getStoredItem('month_e');
                var storedYear2 = this.__merciFunc.getStoredItem('year_e');
                if (storedDay2 != null && storedMonth2 != null && storedYear2 != null) {
                    var offSetDate = new Date(storedMonth2 + "/" + storedDay2 + "/" + storedYear2);
                } else {
                    var todayDate = new Date();
                    var month = todayDate.getMonth();
                    var day = todayDate.getDate();
                    var year = todayDate.getFullYear();
                    var retDay = day + returnDate;
                    var offSetDate = new Date(year, month, retDay, 0, 0, 0);

                }

                $("#datePickTimeTableT").datepicker('setDate', offSetDate);
            }

        },

        __resetInput: function(inputId) {

            var result = "";
            if (typeof(customerAppData) != 'undefined' && (pageTimeTable.__merciFunc.isRequestFromApps() == true || customerAppData.isTestEnvironment) && (typeof customerAppData.departureCityList != "undefined" ) && customerAppData.departureCityList.length > 0) {
                result = document.getElementById(inputId).value;
            } else {
                if (document.getElementById(inputId) != null) {
                    if (document.getElementById(inputId).value.indexOf('(') != -1 && document.getElementById(inputId).value.indexOf(')') != -1) {
                        var b = document.getElementById(inputId).value.split("(");
                        var c = b[1];
                        var d = c.split(")");
                        if (d[0].length != 3) {
                            result = d[0].substring(d[0].length - 3, d[0].length);
                        } else {
                            result = d[0];
                        }
                    } else if (document.getElementById(inputId).value.length == 3) {
                        result = document.getElementById(inputId).value;
                    }
                }
            }
            return result;
        },


        __addParams: function() {

            var bLocation = this.__resetInput("B_LOCATION_1_TT");
            var eLocation = this.__resetInput("E_LOCATION_1_TT");
            document.getElementById("B_LOCATION").value = bLocation;
            document.getElementById("E_LOCATION").value = eLocation;

            var tripTypeValue = "";
            if (document.getElementById("TTroundTrip") != null) {
                var radio = document.getElementById("TTroundTrip");
                if (radio.checked) {
                    tripTypeValue = 'R';
                }
            }

            if (document.getElementById("TTOneWay") != null) {
                var radio = document.getElementById("TTOneWay");
                if (radio.checked) {
                    tripTypeValue = 'O';
                }
            }
            document.getElementById("TRIP_TYPE").value = tripTypeValue;
            var showNewDtPicker = false;
            if (this.moduleCtrl.getModuleData().servicing.MTT_BSR_A != undefined) {
                showNewDtPicker = pageTimeTable.siteParams.showNewDatePicker;
            }
            if (showNewDtPicker != 'TRUE') {
                var day1 = this.getSelectedValue("Date");
                document.getElementById("Day1").value = day1;
                document.getElementById("B_Day").value = day1;

                var day2 = this.getSelectedValue("date_e");
                document.getElementById("Day2").value = day2;
                document.getElementById("E_Day").value = day2;

                var mon1 = this.getSelectedValue("Month");
                document.getElementById("Month1").value = mon1;

                var mon2 = this.getSelectedValue("month_e");
                document.getElementById("Month2").value = mon2;

                var year1 = this.getSelectedValue("Year");
                var year2 = this.getSelectedValue("year_e");

                var date_combined = year1.concat(mon1, day1, "0000");
                document.getElementById("B_DATE").value = date_combined;

                var e_date_combined = year2.concat(mon2, day2, "0000");
                document.getElementById("E_DATE").value = e_date_combined;

            } else {

                var depdayId = document.getElementById("Day1");
                var bdayId = document.getElementById("Date");
                var day1 = $.datepicker.formatDate('dd', $("#datePickTimeTableF").datepicker('getDate'));
                depdayId.value = day1;
                bdayId.value = day1;
                document.getElementById("B_Day").value = day1;
                var depmonthinNo = $.datepicker.formatDate('mm', $("#datePickTimeTableF").datepicker('getDate'));
                var depmonthId = document.getElementById("Month1");
                depmonthId.value = $.datepicker.formatDate('yymm', $("#datePickTimeTableF").datepicker('getDate'));
                var bmonthId = document.getElementById("Month");
                bmonthId.value = depmonthinNo;
                var year1 = $.datepicker.formatDate('yy', $("#datePickTimeTableF").datepicker('getDate'));
                var depyearId = document.getElementById("Year");
                depyearId.value = year1;
                var date_combined = year1.concat(depmonthinNo, day1, "0000");
                document.getElementById("B_DATE").value = date_combined;

                var retdayId = document.getElementById("Day2");
                var edayId = document.getElementById("date_e");
                var day2 = $.datepicker.formatDate('dd', $("#datePickTimeTableT").datepicker('getDate'));
                retdayId.value = day2;
                edayId.value = day2;
                document.getElementById("E_Day").value = day2;
                var retmonthinNo = $.datepicker.formatDate('mm', $("#datePickTimeTableT").datepicker('getDate'));
                var retmonthId = document.getElementById("Month2");
                retmonthId.value = $.datepicker.formatDate('yymm', $("#datePickTimeTableT").datepicker('getDate'));
                var emonthId = document.getElementById("month_e");
                emonthId.value = retmonthinNo;
                var year2 = $.datepicker.formatDate('yy', $("#datePickTimeTableT").datepicker('getDate'));
                var retyearId = document.getElementById("year_e");
                retyearId.value = year2;
                var e_date_combined = year2.concat(retmonthinNo, day2, "0000");
                document.getElementById("E_DATE").value = e_date_combined;


            }
            if ((pageTimeTable.siteParams.siteRetainSearch == 'TRUE') && (jsonResponse.ui.REMEMBER_SRCH_CRITERIA != false)) {
                this.__store_airline_codes(bLocation, "TTJson");
                this.__store_search_criteria(bLocation, eLocation);
            }
        },

        __store_airline_codes: function(loc, itemVal) {
            var arr = [],
                match = false;

            result = pageTimeTable.__merciFunc.getStoredItem(itemVal);

            if (result != null && result != "" && result != "{}") {
                //arr = JSON.parse(localStorage.getItem(itemVal));
                arr = JSON.parse(result);
            }
            for (var j = 0; j < arr.length; j++) {
                if (arr[j] == loc) {
                    match = true;
                    break;
                }
            }
            if (!match) {
                arr.push(loc);
            }
            pageTimeTable.__merciFunc.storeLocal(itemVal, JSON.stringify(arr));
        },

        __store_search_criteria: function(loc, eLoc) {
            var dep = document.getElementById('Year').value + "" + document.getElementById('Month').value + "" + document.getElementById('Date').value;
            var ret = document.getElementById('year_e').value + "" + document.getElementById('month_e').value + "" + document.getElementById('date_e').value;

            if (document.getElementsByName('trip-type')[0].checked) {
                var trip = document.getElementsByName('trip-type')[0].id
            } else {
                var trip = document.getElementsByName('trip-type')[1].id
            }
            var fromEntry = {
                to: eLoc,
                dep_date: dep,
                ret_date: ret,
                trip_type: trip
            }
            pageTimeTable.__merciFunc.storeLocal("TTFrom:" + loc, JSON.stringify(fromEntry), "overwrite", "text");
        },

        __fetchCode: function(inputVal) {
            var result = "";
            if (inputVal.indexOf('(') != -1 && inputVal.indexOf(')') != -1) {
                var b = inputVal.split("(");
                var c = b[1];
                var d = c.split(")");
                if (d[0].length != 3) {
                    result = d[0].substring(d[0].length - 3, d[0].length);
                } else {
                    result = d[0];
                }
            }
            return result;
        },

        getSelectedValue: function(id) {

            var x = document.getElementById(id);
            var selected = x.options[x.selectedIndex].value;
            return selected;
        },

        onGetTimeTableClick: function(args) {
            this.__merciFunc.scrollUp();
            args.preventDefault(true);
            this.__addParams();
            this.storeFormValues();
            var isSubmit = this.validateDates();
            isSubmit = (this.validateCities() && isSubmit);
            if (isSubmit == true) {
                var request = {
                    formObj: document.getElementById('timeTableForm'),
                    action: 'MTimeTable.action',
                    method: 'POST',
                    expectedResponseType: 'json',
                    loading: true,
                    cb: {
                        fn: this.__onGetTimeTableClickCallBack,
                        scope: this
                    }
                };
                modules.view.merci.common.utils.URLManager.makeServerRequest(request, true);
            } else {
                this.$refresh({
                    section: "errors"
                });

                this.data.errors = new Array();
            }

        },

        __onGetTimeTableClickCallBack : function(response){
            var json = this.moduleCtrl.getModuleData();
            var nextPage = response.responseJSON.homePageId;
            var dataId = nextPage.substring(nextPage.lastIndexOf('-') + 1);
            if (response.responseJSON.data != null) {
                if (dataId == 'MTTBRE_ERR_A') {
                    var message = response.responseJSON.data.booking.MError_A.requestParam.listMsg[0].TEXT;
                    this.addErrorMessage(message);
                    this.$refresh({
                    section: "errors"
                    });
                    var mask = document.getElementsByClassName("msk")[0];
                    mask.style.display = "none";
                }else{
                    if (this.data.errors != null) {
                        this.data.errors.pop();
                    }
                    this.__merciFunc.extendModuleData(this.moduleCtrl.getModuleData(), response.responseJSON.data);
                    this.moduleCtrl.navigate(null, nextPage);
                }
            }
        },

        incrementYear: function(date) {
            date.setDate(date.getDate() + 365);
            return date.getFullYear();

        },

        onDayChange: function(evt, da) {
            var monthIndex = $('#' + da.monthdd + ' option:selected').val();
            var yearIndex = $('#' + da.yeardd + ' option:selected').val();

        },

        onMonthChange: function(evt, dd) {
            var monthSel = $('#' + dd.monthdd + ' option:selected').val();
            var month = parseInt(monthSel, 10) - 1;
            var year = $('#' + dd.yeardd + ' option:selected').val();
            var noDaysArr = [31, !(year % 4 == 0) ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var dayDDOptions = $('#' + dd.daydd + '>option');
            if (dayDDOptions.length != noDaysArr[month]) {
                if (dayDDOptions.length < noDaysArr[month]) {
                    for (var k = dayDDOptions.length + 1; k <= noDaysArr[month]; k++) {
                        if (k < 10) {
                            var buffer0 = '0';
                        } else {
                            buffer0 = '';
                        }
                        $('#' + dd.daydd)
                            .append($("<option></option>")
                                .attr("value", buffer0 + k)
                                .text(buffer0 + k)
                        );
                        buffer0 = '';
                    }
                } else {
                    for (var k = dayDDOptions.length; k > noDaysArr[month]; k--) {
                        $('#' + dd.daydd + " option[value=" + k + "]").remove();
                    }
                }
            }
			this.updateDatePicker(evt,dd);			
        },

        onYearChange: function(evt, da) {
            var dayIndex = $('#' + da.daydd + ' option:selected').val();
            var monthIndex = $('#' + da.monthdd + ' option:selected').val();
			this.updateDatePicker(evt,da);			
        },
		
		updateDatePicker : function(evt, args) {
            var dayIndex = $('#' + args.daydd + ' option:selected').val();
            var monthIndex = $('#' + args.monthdd + ' option:selected').val()-1;
            var yearIndex = $('#'+args.yeardd + ' option:selected').val();
            $('#' + args.datePick).datepicker("setDate", new Date(yearIndex, monthIndex, dayIndex));
			
		},		


        onInputFocus: function(event, args) {
            var delEL = document.getElementById('del' + args.id);
            if (delEL != null) {
                delEL.className += ' deletefocus';
            }
        },

        onInputBlur: function(event, args) {
            var delEL = document.getElementById('del' + args.id);
            if (delEL != null) {
                delEL.className = delEL.className.replace(/(?:^|\s)deletefocus(?!\S)/g, '');
            }
        },

        validateDates: function() {

            var ret_type = 'true';
            var dep_date = new Date(document.getElementById("Year").value, document.getElementById("Month").value, document.getElementById("Date").value);
            var ret_date = new Date(document.getElementById("year_e").value, document.getElementById("month_e").value, document.getElementById("date_e").value);
            var tripType = document.getElementById("TRIP_TYPE").value;
            if (tripType == "R" && dep_date.getTime() > ret_date.getTime()) {
                this.resetDate();
                var message = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.labels.tx_merci_tt_returnsearcherror;
                this.addErrorMessage(message);
                return false;
            } else {
                return true;
            }

        },

	validateCities: function() {

		var bLoc = document.getElementById("B_LOCATION").value;
		var eLoc = document.getElementById("E_LOCATION").value;

		// Custom Airport List 
		if (typeof(customerAppData) != 'undefined' && (pageTimeTable.__merciFunc.isRequestFromApps() == true || customerAppData.isTestEnvironment) && (typeof customerAppData.departureCityList != "undefined" ) && customerAppData.departureCityList.length > 0 && typeof(setInputFieldsWithCode) != 'undefined') {

			setInputFieldsWithCode(document.getElementById("B_LOCATION"), document.getElementById("E_LOCATION"));
				
			return true;

		} else {

			if (bLoc.length != 3 || eLoc.length != 3) {
				var message = this.moduleCtrl.getModuleData().servicing.MTT_BSR_A.errorStrings['2130404'].localizedMessage + ' (2130404)';
				this.addErrorMessage(message);
				return false;
			} else {
				return true;
			}
		}
	},

        addErrorMessage: function(message) {

            /* if errors is empty*/
            if (this.data.errors == null) {
                this.data.errors = new Array();
            }

            /* create JSON and append to errors*/
            var error = {
                'TEXT': message
            };
            this.data.errors.push(error);

        },

        storeFormValues: function() {
            if (document.getElementById("B_LOCATION_1_TT") != null) {
                this.__merciFunc.storeLocal("B_LOCATION_1_TT", document.getElementById("B_LOCATION_1_TT").value, "overwrite", "text");
            }

            if (document.getElementById("E_LOCATION_1_TT") != null) {
                this.__merciFunc.storeLocal("E_LOCATION_1_TT", document.getElementById("E_LOCATION_1_TT").value, "overwrite", "text");
            }

            if (document.getElementById("TTOneWay") != null) {
                this.__merciFunc.storeLocal("TTOneWay", document.getElementById("TTOneWay").checked, "overwrite", "text");
            }

            if (document.getElementById("TTroundTrip") != null) {
                this.__merciFunc.storeLocal("TTroundTrip", document.getElementById("TTroundTrip").checked, "overwrite", "text");
            }

            if (document.getElementById("Date") != null) {
                if (document.getElementById("Date").value == null) {
                    this.__merciFunc.storeLocal("Date", document.getElementById("Date").value, "overwrite", "text");
                } else {
                    this.__merciFunc.storeLocal("Date", document.getElementById("Date").value, "overwrite", "text");
                }
            }

            if (document.getElementById("Month") != null) {
                this.__merciFunc.storeLocal("Month", document.getElementById("Month").value, "overwrite", "text");
            }

            if (document.getElementById("Year") != null) {
                this.__merciFunc.storeLocal("Year", document.getElementById("Year").value, "overwrite", "text");
            }

            if (document.getElementById("date_e") != null) {
                if (document.getElementById("date_e").value == null) {
                    this.__merciFunc.storeLocal("date_e", document.getElementById("date_e").value, "overwrite", "text");
                } else {
                    this.__merciFunc.storeLocal("date_e", document.getElementById("date_e").value, "overwrite", "text");
                }
            }

            if (document.getElementById("month_e") != null) {
                this.__merciFunc.storeLocal("month_e", document.getElementById("month_e").value, "overwrite", "text");
            }

            if (document.getElementById("year_e") != null) {
                this.__merciFunc.storeLocal("year_e", document.getElementById("year_e").value, "overwrite", "text");
            }
        },

        _radioSelectionValue: function(radioId) {
            if (this.__merciFunc.getStoredItem(radioId) != null) {
                var radioStored = this.__merciFunc.getStoredItem(radioId);
                if (radioStored == 'true') {
                    return 'checked="checked"';
                }
            } else {
                if (radioId == 'TTroundTrip') {
                    return 'checked="checked"';
                }
            }

            return '';
        },

        _isDaySelected: function(dayLabel, currDay, value) {
            var dayStored = parseInt(this.__merciFunc.getStoredItem(dayLabel), 10);
            if (dayStored == null) {
                return currDay == value;
            }

            return dayStored == value;
        },

        _isMonthSelected: function(monthLabel, currMonth, value) {
            var monthStored = parseInt(this.__merciFunc.getStoredItem(monthLabel), 10);
            if (monthLabel == null) {
                return currMonth == value;
            }

            return monthStored == value;
        },

        _isYearSelected: function(yearLabel, currYear, value) {
            var yearStored = parseInt(this.__merciFunc.getStoredItem(yearLabel), 10);
            if (yearLabel == null) {
                return currYear == value;
            }

            return yearStored == value;
        },

        prepopulateValues: function() {
            var bLocation = document.getElementById('B_LOCATION_1_TT');
            if (bLocation != null) {

                // get data from storage
                var bLocationData = this.__merciFunc.getStoredItem('B_LOCATION_1_TT');

                // if in storage
                if (bLocationData != null && bLocationData != '') {
                    bLocation.value = bLocationData;
                    $('#delB_LOCATION_1_TT').removeClass('hidden');
                }
            }

            var eLocation = document.getElementById('E_LOCATION_1_TT');
            if (eLocation != null) {

                // get data from storage
                var eLocationData = this.__merciFunc.getStoredItem('E_LOCATION_1_TT');

                // if in storage
                if (eLocationData != null && eLocationData != '') {
                    eLocation.value = eLocationData;
                    $('#delE_LOCATION_1_TT').removeClass('hidden');
                }
            }

        }

    }
});