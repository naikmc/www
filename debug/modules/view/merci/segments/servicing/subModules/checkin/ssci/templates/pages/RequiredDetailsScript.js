Aria.tplScriptDefinition({
  $classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.pages.RequiredDetailsScript',

  $dependencies: [

    'modules.view.merci.common.utils.MerciGA'
  ],

  $constructor: function() {
    try {
      this.$logInfo('RequiredDetailsScript::Entering $constructor function');
      this.__ga = modules.view.merci.common.utils.MerciGA;
       this.KarmaDataReady = {};
this.KarmaDisplayReady = { "T25" : []};
this.KarmaShowRequiredFileds = { "T26" : [], "T28" : []};
this.KarmaEditNationality = {};
this.KarmaChooseSubmit = {};
this.KarmaCheckED = {};
this.KarmaCheckDatIssue = {};
this.KarmacheckDOB = {};

      this.currDate = "";
      /*
       * some times there will be multiple identity document asked in one list
       *
       *     "choices": [
		        {
		        //passport
		            "documentType": "2",
		            "documentFields": [
		                "6",
		                "7",
		                "14",
		                "15"
		            ],
		            "fields": [ ]
		        },
		        {
		            //other document details
		            "documentType": "14",
		            "documentFields": [
		                "6",
		                "7",
		                "14",
		                "15"
		            ],
		            "fields": [ ]
		        }
		    ],
    "suggestions": [ ],
    "type": "IdentityDocument"
       *
       * in this case DCS expecting only one document so providing list to user to select
       * identityDocumentRequired - holds choice bean of choices.
       * */
      this.identityDocumentRequired = null;

      this.dateSupportByBrowser=checkDateInput();
      jQuery(document).on("change",".sectionDefaultstyleSsci [data-is-date-li] input[type='date']",function(){

    	 /*For setting date picker hidden variable*/
         jQuery(this).next().val(jQuery(this).val());
         /*For setting date picker*/
         jQuery(this).next().next().html("<time>" + jQuery(this).val() + "</time>");

      });

    } catch (exception) {
      this.$logError('RequiredDetailsScript::An error occured in $constructor function', exception);
    }
  },
  $destructor: function() {

	  jQuery(document).off("change",".sectionDefaultstyleSsci [data-is-date-li] input[type='date']");
	  jsonResponse.showHideAutoCompleteFlag=undefined;
	},
  $prototype: {
    $dataReady: function() {
      this.$logInfo('RequiredDetailsScript::Entering dataReady function');
      try {

	  /*
       * For filter pax whose regulatory is empty
       * */
      this.tempSelectedCPR = this.$json.copy(this.moduleCtrl.getSelectedCPR());
      this.moduleCtrl.setSelectedCPR(this.$json.copy(this.data.regulatoryAlteredSelCpr));
      this.data.regulatoryAlteredSelCpr.selectedCPR=this.tempSelectedCPR;

      /*in case of click back where this.data.regPageLandingPaxIndex holds wrong index*/
      var selectedCPR = this.moduleCtrl.getSelectedCPR();
      if (this.data.regPageLandingPaxIndex == null || this.data.regPageLandingPaxIndex >= selectedCPR.custtoflight.length) {
        if (this.data.regPageLandingPaxIndex == null) {
          this.data.regPageLandingPaxIndex = 0;
        } else {
          this.data.regPageLandingPaxIndex = 0;
          //this.data.regPageLandingPaxIndex--;
        }
        this.KarmaDataReady["T24"] = "In case of click back where this.data.regPageLandingPaxIndex holds wrong index";
      }

      this.currDate = this.moduleCtrl.getsvTime("yyyy-mm-dd");

      var tempDate = new Date(this.currDate);
      this.__data = {
        date: {
          curYear: tempDate.getFullYear(),
          curMonth: tempDate.getMonth(),
          curDay: tempDate.getDate()
        }
      };

      this.requestParam = this.moduleCtrl.getModuleData().checkIn.MSSCIRequiredDetails_A.requestParam;
      this.label = this.moduleCtrl.getModuleData().checkIn.MSSCIRequiredDetails_A.labels;
      this.siteParams = this.moduleCtrl.getModuleData().checkIn.MSSCIRequiredDetails_A.siteParam;
      this.parameters = this.moduleCtrl.getModuleData().checkIn.MSSCIRequiredDetails_A.parameters;

      this.moduleCtrl.setHeaderInfo({
        title: this.label.Title,
        bannerHtmlL: this.requestParam.bannerHtml,
        homePageURL: this.siteParams.homeURL,
        showButton: true
      });

      this.errorStrings = this.moduleCtrl.getModuleData().checkIn.MSSCIRequiredDetails_A.errorStrings;
        this.data.siteParameters = this.parameters;
        this.data.pageLabels = this.label;
        this.data.pageErrors=this.errorStrings;
      /*Has to remove
       * 213002228(original created and replaced in req places includng Msscireqdetails json and reqdetail.tpl) == 10000001(dummy jst used tempararly)

      this.errorStrings[10000001].errorid = 10000001;
      this.errorStrings[10000001].localizedMessage = "{0} : Valid Characters are A-Z, a-z, 0-9, hyphen (-), dot (.), parentheses(()) and space.";
      /*End has to remove once error created*/
      this.currentPagePosition = 0;

      /*RMV
        this.label.issueDate = "Issue date";
        this.errorStrings["213002300"] = {
          "errorid": "213002300",
          "localizedMessage": "{0} can not be today or future date"
        };
      /*END RMV*/

      /*For forming other document types based on parameters and strings*/
      var docNum = this.parameters.SITE_SSCI_REG_OTH_TYP_LST.split(",");
      /*
       * This list taken from SSCi code document and these are all types that ssci may ask as part of other document missing
       * */
      this.othDocList = [3, 4, 5, 13, 14, 100, 101, 102, 103, 104, 105, 106, 107];
      for (var i = 0; i < docNum.length; i++) {
        this.data.otherDocumentTypeList[docNum[i].trim()] = this.label["otherDocTyp" + docNum[i].trim()];
      }

      /*
       * For hilighting particulat oter doc type which SSCI ASKS
       * Ex: For greencard error it is 14
       * */
      this.hilightParticularOthDocType = null;
      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in dataReady function', exception);
      }

    },

    $destructor: function() {

      if (this.data.documentFileds.othPrefilled != null) {
        this.data.documentFileds.othPrefilled.othPrefilled = null;
    	}
      if (this.data.documentFileds.visaPrefilled != null) {
        this.data.documentFileds.visaPrefilled.visaPrefilled = null;
      }
      if (this.data.documentFileds.pspPrefilled != null) {
        this.data.documentFileds.pspPrefilled.pspPrefilled = null;
      }

      this.data.inNatEditScreen = false;

      /*
       * For filter pax whose regulatory is empty
       * */
      if(this.data.regulatoryAlteredSelCpr.continueAsSelCPR == undefined)
      {
    	  this.moduleCtrl.setSelectedCPR(this.$json.copy(this.tempSelectedCPR));
      }
    },

    $displayReady: function() {
      this.$logInfo('RequiredDetailsScript::Entering displayReady function');
      try {

      /*To Display Warning Messages*/
      this.moduleCtrl.getWarningsForThePage("REG", this);

      var _this = this;
      /*For date picker*/
      $("[val*='dob']").each(function() {
        if ($(this).attr("disabled") == undefined) {
          var date = $(this).val();
          var dateArray = date.split("-");

          _this.datePicker($(this).attr("name"), this, "dob");
          var defaultYear1 = $.datepicker.formatDate('yy', $(this).datepicker('getDate'));
          var defaultMonth1 = $.datepicker.formatDate('mm', $(this).datepicker('getDate'));
          var defaultDay1 = $.datepicker.formatDate('dd', $(this).datepicker('getDate'));

          /*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
          if (defaultYear1 == "" && defaultMonth1 == "" && defaultDay1 == "") {
            $(this).next().html("<time></time>");
            _this.KarmaDisplayReady["T25"].push("The DOB and DOE should not be defaulted to current date");
          } else {
            $(this).next().html("<time>" + defaultYear1 + "-" + defaultMonth1 + "-" + defaultDay1 + "</time>");
          }

          $(this).next().click(function() {
            $('.sectionRequiredDetailsBase').hide();
            $('#ui-datepicker-div').show();
            $('.banner').hide();
          });

        }

      });

      $("[val*='datIssue']").each(function() {
          if ($(this).attr("disabled") == undefined) {
            var date = $(this).val();
            var dateArray = date.split("-");

            _this.datePicker($(this).attr("name"), this, "datIssue");
            var defaultYear1 = $.datepicker.formatDate('yy', $(this).datepicker('getDate'));
            var defaultMonth1 = $.datepicker.formatDate('mm', $(this).datepicker('getDate'));
            var defaultDay1 = $.datepicker.formatDate('dd', $(this).datepicker('getDate'));

            /*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
            if (defaultYear1 == "" && defaultMonth1 == "" && defaultDay1 == "") {
              $(this).next().html("<time></time>");
              _this.KarmaDisplayReady["T25"].push("The DOB and DOE should not be defaulted to current date");
            } else {
              $(this).next().html("<time>" + defaultYear1 + "-" + defaultMonth1 + "-" + defaultDay1 + "</time>");
            }

            $(this).next().click(function() {
              $('.sectionRequiredDetailsBase').hide();
              $('#ui-datepicker-div').show();
              $('.banner').hide();
            });

          }

        });

      $("[val*='ed']").each(function() {

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
          _this.KarmaDisplayReady["T25"].push("The DOB and DOE should not be defaulted to current date");
        } else {
          $(this).next().html("<time>" + defaultYear1 + "-" + defaultMonth1 + "-" + defaultDay1 + "</time>");
        }

        $(this).next().click(function() {
          $('.sectionRequiredDetailsBase').hide();
          $('#ui-datepicker-div').show();
          $('.banner').hide();
        });



      });

      //this.showRequiredFileds();
      /*For nat edit*/
      if (this.data.inNatEditScreen) {
        jQuery("#editnatbutton").click();
      } else {
        /*
         * Show fields in regulatory page based on response, response always contains missing fileds
         * if what ever regulatory data filled already, that showing taken care by TPL
         * */
        this.showRequiredFileds();

        /*For remove passport incase it is not required for particular flight
         * i.e in edit nationality passport details shown only if passport details already filled or
         *
         * passport details asked by check regulatory service and yet to fill
         *
        if(jQuery("#pspinfo0").parent("section").hasClass("displayNone") == true)
        {
          jQuery("#natedit0 li").not(":first-child").removeClass("displayBlock").addClass("displayNone");
        }else
        {
          jQuery("#natedit0 li").not(":first-child").removeClass("displayNone").addClass("displayBlock");
        }*/
      }

      var _this = this.moduleCtrl;

  	  _this.setErrors("");

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in displayReady function', exception);
      }

    },

    $viewReady: function() {

      this.$logInfo('RequiredDetailsScript::Entering viewReady function');
      try {
       var _this = this;
      /*For adding or not adding auto complete based on USA or other root*/
      jQuery(document).on("focus","input[datastatesel='select-state']", function() {

        if (jQuery(this).parentsUntil("li").eq(jQuery(this).parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^usa$/ig) != -1 || jQuery(this).parentsUntil("li").eq(jQuery(this).parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^us$/ig) != -1 || jQuery(this).parentsUntil("li").eq(jQuery(this).parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^UNITED STATES OF AMERICA$/ig) != -1) {
          var parent = jQuery(this).parentsUntil(".searchInput").eq(jQuery(this).parentsUntil(".searchInput").length - 1).parent();
          var atdelegate_parent = parent.attr("atdelegateNotReq");
          var atdelegate_input = jQuery(this).attr("atdelegateNotReq");

          if (atdelegate_parent != undefined && atdelegate_input != undefined) {
            parent.attr("atdelegate", atdelegate_parent);
            jQuery(this).attr("atdelegate", atdelegate_input);
          }
          jsonResponse.showHideAutoCompleteFlag=true;

        } else {
          var parent = jQuery(this).parentsUntil(".searchInput").eq(jQuery(this).parentsUntil(".searchInput").length - 1).parent();
          var atdelegate_parent = parent.attr("atdelegate");
          var atdelegate_input = jQuery(this).attr("atdelegate");

          parent.removeAttr("atdelegate");
          parent.attr("atdelegateNotReq", atdelegate_parent);
          jQuery(this).removeAttr("atdelegate");
          jQuery(this).attr("atdelegateNotReq", atdelegate_input);
          jQuery(this).next().addClass("hidden");

          jsonResponse.showHideAutoCompleteFlag=false;
        }

      });
        /*GOOGLE ANALYTICS*/
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
        /*BEGIN : JavaScript Injection(CR08063892)*/
        if (typeof genericScript == 'function') {
			genericScript({
				tpl:"RequiredDetails",
				data:this.data
			});
        }
        /*END : JavaScript Injection(CR08063892)*/

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in viewReady function', exception);
      }
    },

    showRequiredFileds: function() {
      this.$logInfo('RequiredDetailsScript::Entering showRequiredFileds function');
      try {
      var cprRes = this.moduleCtrl.getCPR();
      var selectedCPR = this.moduleCtrl.getSelectedCPR();
      var custId = selectedCPR.custtoflight[this.data.regPageLandingPaxIndex].customer;
      var regBean = cprRes[selectedCPR.journey].customerDetailsBeans[custId].regulatoryDetails;

      /*Nationality initially set to readonly and button disabled*/
      jQuery("#nationality").attr("readonly", "readonly");
      jQuery("#nationality").parents(".searchInput").next().attr("disabled", "disabled").addClass("disabled");
      jQuery(".message.info").removeClass("displayBlock").addClass("displayNone");

      /*For nationality auto complete to not show*/
      var parent = jQuery("#nationality").parentsUntil(".searchInput").eq(jQuery("#nationality").parentsUntil(".searchInput").length - 1).parent();
      var atdelegate_parent = parent.attr("atdelegate");
      var atdelegate_input = jQuery("#nationality").attr("atdelegate");

      parent.removeAttr("atdelegate");
      parent.attr("atdelegateNotReq", atdelegate_parent);
      jQuery("#nationality").removeAttr("atdelegate");
      jQuery("#nationality").attr("atdelegateNotReq", atdelegate_input);

      jQuery("#nationality").next().addClass("hidden");
      /*End For nationality auto complete to not show*/


      var regChoics = regBean.choices;
      /* VERY IMPORTANT STEP
       *
       * 1. usually ICheckRegulatorySSCI action return nationality as missing first and based on nationality it return other missing fields
       *
       * above scenario working fine for SQ, but for 6X PNRS
       *
       * at first instant it-self it is asking nationality and other information.
       *
       * Taking JFE as reference when nationality asks, removing all other info
       *
       * Based on oth parameter SITE_SSCI_OTHDOCS_DSPLY  we remove oth details from the choice list
       *
       * */
      for (var i = 0; i < regChoics.length; i++) {
        //Nationality Details -- nationality required
        if (regChoics[i].type != null && regChoics[i].type != undefined && regChoics[i].type.search(/Nationality/i) != -1 && regChoics.length > 1) {
          /*
           * remove all missing info except nationality
           *
           * */
          this.KarmaShowRequiredFileds["T1"] = "remove all missing info except nationality";
          var temp = regChoics[i];
          regChoics.length = 0;
          regChoics.push(temp);
          break;
          } else if (this.parameters.SITE_SSCI_OTHDOCS_DSPLY != undefined && this.parameters.SITE_SSCI_OTHDOCS_DSPLY.search(/false/i) != -1 && regChoics[i].type != null && regChoics[i].type != undefined && regChoics[i].type.search(/IdentityDocument/i) != -1) {
            if (regChoics[i].choices != null && regChoics[i].choices != undefined && regChoics[i].choices.length > 1) {
        		for (var j in regChoics[i].choices) {
                    //Passport -- code 2
                    if (regChoics[i].choices[j].documentType != null && regChoics[i].choices[j].documentType != undefined && regChoics[i].choices[j].documentType == "2") {
                    	var temp = regChoics[i].choices[j];
                  regChoics[i].choices.length = 0;
                    	regChoics[i].choices.push(temp);
                      this.KarmaShowRequiredFileds["T26"] = "Pushing Passport -- code 2 to choices";
                    }
        		}
        	}
        }
      }
      

      this.KarmaShowRequiredFileds["T1"] == "remove all missing info except nationality";
      /*End remove other things if nationality is there*/
      for (var i = 0; i < regChoics.length; i++) {
        //Nationality Details -- nationality required
        if (regChoics[i].type != null && regChoics[i].type != undefined && regChoics[i].type.search(/Nationality/i) != -1) {
          /*For showing nationality block*/
          jQuery(jQuery("#nationality").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
          jQuery(jQuery("#nationality").parents("section")[0]).children("ul").find("li").removeClass("displayNone").addClass("displayBlock");

          jQuery("#nationality").removeAttr("readonly");
          jQuery("#nationality").parents(".searchInput").next().removeAttr("disabled").removeClass("disabled");
          jQuery(".message.info").removeClass("displayBlock").addClass("displayNone");
          this.KarmaShowRequiredFileds["T2"] = "Nationality displayBlock";
          /*For nationality auto complete to show*/
          var parent = jQuery("#nationality").parentsUntil(".searchInput").eq(jQuery("#nationality").parentsUntil(".searchInput").length - 1).parent();
          var atdelegate_parent = parent.attr("atdelegateNotReq");
          var atdelegate_input = jQuery("#nationality").attr("atdelegateNotReq");

          if (atdelegate_parent != undefined && atdelegate_input != undefined) {
            parent.attr("atdelegate", atdelegate_parent);
            jQuery("#nationality").attr("atdelegate", atdelegate_input);
            jQuery("#nationality").next().removeClass("hidden");
          }
          this.KarmaShowRequiredFileds["T3"] = "Nationality AutoComplete shown";
          /*End For nationality auto complete to show*/

          /*For en-ableing next continue button*/
          jQuery("#MRequiredDetails_A>footer #continueButton").removeClass("disabled").removeAttr("disabled");
          jQuery("#MRequiredDetails_A>footer #nextButton").removeClass("disabled").removeAttr("disabled");
          /*End en-ableing next continue button*/

          if (regChoics.length == 1) {
            jQuery(jQuery("#nationality").parents("section")[0]).nextAll("section").removeClass("displayBlock").addClass("displayNone");
            jQuery(".message.info").removeClass("displayNone").addClass("displayBlock");

            /*For dis-ableing next continue button*/
            jQuery("#MRequiredDetails_A>footer #continueButton").addClass("disabled").attr("disabled", "disabled");
            jQuery("#MRequiredDetails_A>footer #nextButton").addClass("disabled").attr("disabled", "disabled");
            /*End dis-ableing next continue button*/

            break;
          }

        }

        //DateOfBirth && country of residence
        if (regChoics[i].type != null && regChoics[i].type != undefined && (regChoics[i].type.search(/PersonalDetails/i) != -1 || regChoics[i].type.search(/CountryOfResidence/i) != -1)) {
          if (regChoics[i].choices != null && regChoics[i].choices != undefined && regChoics[i].choices.length > 0) {
            for (var j in regChoics[i].choices) {
              if (regChoics[i].choices[j].fields != null && regChoics[i].choices[j].fields != undefined && regChoics[i].choices[j].fields.length > 0) {
                for (var k in regChoics[i].choices[j].fields) {
                  //DOB
                  if (regChoics[i].choices[j].fields[k] == 3) {
                    jQuery("#dob").parent().removeClass("displayNone").addClass("displayBlock");
                    jQuery(jQuery("#dob").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
                    this.KarmaShowRequiredFileds["T4"]="DOB Displayed";
                  }
                  //Gender
                  if (regChoics[i].choices[j].fields[k] == 5) {
                    jQuery("[name='gender']").removeAttr("disabled");
                    jQuery(".genderBlock").removeClass("displayNone").addClass("displayBlock");
                    jQuery(jQuery("[name='gender']").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
                    this.KarmaShowRequiredFileds["T5"]="Gender Displayed"; //For TDD
                  }
                  //COR
                  if (regChoics[i].choices[j].fields[k] == 18) {
                    jQuery("#cor").parents(".searchInput").parent().removeClass("displayNone").addClass("displayBlock");
                    jQuery(jQuery("#cor").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
                    this.KarmaShowRequiredFileds["T6"]="COR  Displayed";
                  }

                  //POB - missing
                  //Taken based on SSCi code set
                  if (regChoics[i].choices[j].fields[k] == 4) {
                    jQuery("#pob").parent().removeClass("displayNone").addClass("displayBlock");
                    jQuery(jQuery("#pob").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
                    this.KarmaShowRequiredFileds["T7"]="POB  Displayed";
                  }
                }
              }
            }
          }
        }

        //Passport
        if (regChoics[i].type != null && regChoics[i].type != undefined && regChoics[i].type.search(/IdentityDocument/i) != -1) {
          if (regChoics[i].choices != null && regChoics[i].choices != undefined && regChoics[i].choices.length > 0) {
            for (var j in regChoics[i].choices) {
              //Passport -- code 2
              if (regChoics[i].choices[j].documentType != null && regChoics[i].choices[j].documentType != undefined && regChoics[i].choices[j].documentType == "2") {

                  if (regChoics[i].choices[j].documentFields != undefined) {
                    this.data.documentFileds.pspFields = regChoics[i].choices[j].documentFields;
                  } else {
                    this.data.documentFileds.pspFields = [];
                  }

                  if (regChoics[i].choices.length == 1) {
                    this.changeDocumentsRequiredDetails(null, {
                      value: "pspnumber"
                    });
            	  	}

                //For prefilling passport nationality
                  if (regChoics[i].pspPrefilled == null) {
                    this.prefillNationality("nationality", ["pspissueath", "pspissuecntry"]);
                    setTimeout(function(i, data) {
                      regChoics[i].pspPrefilled = true;
                      data.documentFileds.pspPrefilled = regChoics[i];
                    }.bind(this, i, this.data), 400);
                     this.KarmaShowRequiredFileds["T8"]="prefillNationality called";

                  }


                  /*For or condition implementation*/
                  this.identityDocumentRequired = regChoics[i];
	                /*End for or condition implementation*/


              }
            }
          }
        }

        //Visa
        if (regChoics[i].type != null && regChoics[i].type != undefined && regChoics[i].type.search(/Visa/i) != -1) {
          if (regChoics[i].choices != null && regChoics[i].choices != undefined && regChoics[i].choices.length > 0) {
            for (var j in regChoics[i].choices) {
              //Visa -- code 1
              if (regChoics[i].choices[j].documentType != null && regChoics[i].choices[j].documentType != undefined && regChoics[i].choices[j].documentType == "1") {

                  if (regChoics[i].choices[j].documentFields != undefined) {
                    this.data.documentFileds.visaFields = regChoics[i].choices[j].documentFields;
                  } else {
                    this.data.documentFileds.visaFields = [];
                  }

                  /*For showing hiding apropiate fields*/
                  if (this.data.documentFileds.visaFields.length == 0) {
            		jQuery(jQuery("#visanumber").parents("section")[0]).children("ul").find("li").removeClass("displayNone").addClass("displayBlock");

                  } else {
                    for (var vf in this.data.documentFileds.visaFields) {
                      var tvf = this.data.documentFileds.visaFields[vf];
                      jQuery(jQuery("#visanumber").parents("section")[0]).children("ul").find("li[data-fieldno='" + tvf + "']").removeClass("displayNone").addClass("displayBlock");
            		}
                this.KarmaShowRequiredFileds["T27"]="Displayed more than one visa fields"
            	}
                jQuery(jQuery("#visanumber").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
                this.KarmaShowRequiredFileds["T9"]="Visa fields shown";
            	/*End for showing hiding apropiate fields*/

            	//For prefilling visa nationality
                  if (regChoics[i].visaPrefilled == null) {
                    this.prefillNationality("nationality", ["visaissuecntry", "visaissueath"]);
                    this.KarmaShowRequiredFileds["T10"]="prefillNationality called";
                    setTimeout(function(i, data) {
                      regChoics[i].visaPrefilled = true;
                      data.documentFileds.visaPrefilled = regChoics[i];
                    }.bind(this, i, this.data), 400);

        	  	}

              }
            }
          }
        }

        //Other document details, shown on green card required, most possibly or in case of 6x PDT environment it is coming for all types of PNR
        if (regChoics[i].type != null && regChoics[i].type != undefined && (regChoics[i].type.search(/GreenCard/i) != -1 || regChoics[i].type.search(/IdentityDocument/i) != -1)) {

          if (regChoics[i].choices != null && regChoics[i].choices != undefined && regChoics[i].choices.length > 0) {
            for (var j in regChoics[i].choices) {
              //documentType number in this.othDocList array then it has to ask for other document details
              if (regChoics[i].choices[j].documentType != null && regChoics[i].choices[j].documentType != undefined && this.othDocList.indexOf(parseInt(regChoics[i].choices[j].documentType)) != "-1") {

                  if (regChoics[i].choices[j].documentFields != undefined) {
                    this.data.documentFileds.othFields = regChoics[i].choices[j].documentFields;
                  } else {
                    this.data.documentFileds.othFields = [];
                  }

                  /*
                   * if oth missing detail return only one doc then it hilight and select box disabled, other wise user provide option to select by enable select box
                   * */
                  if (regChoics[i].choices.length > 1) {

                	  if(jQuery("#othdoctype").attr("disabled") != undefined)
                	  {
                		  jQuery("#othdoctype").removeAttr("disabled");
                    	  jQuery("#othdoctype").html("");
                	  }

                	  for(var idDetils in this.data.otherDocumentTypeList)
                	  {
                		  if(regChoics[i].choices[j].documentType == idDetils)
                		  {
                			  jQuery("#othdoctype").append("<option value=\""+idDetils+"\">"+this.data.otherDocumentTypeList[idDetils]+"</option>");
                		  }
                	  }
                     this.KarmaShowRequiredFileds["T11"]="more than one othdoctype";
            	  	}


                    /*
                     * if greencard or identificationdocument contines all oth missing info then we show oth section
                     * other wise it depends on SSCI_OTHDOCS_DSPLY to display drop down to select between psp and oth or to diplay only psp.
                     * */
                    if(jQuery("#othdoctype option").length == regChoics[i].choices.length)
            	  	{
                    this.changeDocumentsRequiredDetails(null, {
                      value: "othdoctype"
                    });
            	  	}

                  if(this.hilightParticularOthDocType == null)
                  {
                this.hilightParticularOthDocType = regChoics[i].choices[j].documentType;
                  }

	                /*For or condition implementation*/
                  this.identityDocumentRequired = regChoics[i];
	                /*End for or condition implementation*/

	              //For prefilling oth nationality
                  if (regChoics[i].othPrefilled == null) {
                    this.prefillNationality("nationality", ["othissuecntry", "othissueath"]);
                    setTimeout(function(i, data) {
                      regChoics[i].othPrefilled = true;
                      data.documentFileds.othPrefilled = regChoics[i];
                    }.bind(this, i, this.data), 400);
	        	  	}

              }
            }
          }

          /*Only is it is not null, means it is required some more info of same pax and showing error on that case*/
          if (this.data.regulatoryInPageErrors != null && regChoics[i].type.search(/GreenCard/i) != -1) {
            this.data.regulatoryInPageErrors = "greencard";
          }


        }

        //Destination address, Home address
        if (regChoics[i].type != null && regChoics[i].type != undefined && regChoics[i].type.search(/Address/i) != -1) {

        	for (var j in regChoics[i].choices) {
        		/*
        		 * home address shown if fields not empty
        		 * */
        		if(!jQuery.isUndefined(regChoics[i].choices[j].fields))
        		{
        			if(regChoics[i].choices[j].fields.length == 0)
        	        {
        				jQuery(jQuery("#homeaddrstreet").parents("section")[0]).children("ul").find("li").removeClass("displayNone").addClass("displayBlock");
        	        }else
        	        {
        	        	for(var hFild in regChoics[i].choices[j].fields)
        	        	{
        	        		var tvf = regChoics[i].choices[j].fields[hFild];
                            jQuery(jQuery("#homeaddrstreet").parents("section")[0]).children("ul").find("li[data-fieldno='" + tvf + "']").removeClass("displayNone").addClass("displayBlock");
        	        	}
        	        }
        			jQuery(jQuery("#homeaddrstreet").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
              this.KarmaShowRequiredFileds["T12"]="home address shown if fields not empty";
        		}else
        		{
        			if(regChoics[i].choices[j].fields.length == 0)
        	        {
        				jQuery(jQuery("#destaddrstreet").parents("section")[0]).children("ul").find("li").removeClass("displayNone").addClass("displayBlock");
        	        }else
        	        {
        	        	for(var dFild in regChoics[i].choices[j].fields)
        	        	{
        	        		var tvf = regChoics[i].choices[j].fields[dFild];
                            jQuery(jQuery("#destaddrstreet").parents("section")[0]).children("ul").find("li[data-fieldno='" + tvf + "']").removeClass("displayNone").addClass("displayBlock");
        	        	}
        	        }
          jQuery(jQuery("#destaddrstreet").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
              this.KarmaShowRequiredFileds["T13"]="Destination address shown if fields is empty";

        		}
        	}
        }

        //Home address - missing

        //Emergency contact details
          if (regChoics[i].type != null && regChoics[i].type != undefined && regChoics[i].type.search(/EmergencyContact/i) != -1 && jQuery("#Emergencyaddress01").css("display") != "none") {
          jQuery(jQuery("#emgrcontactname").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
          jQuery(jQuery("#emgrcontactname").parents("section")[0]).find("div").children("ul:last-child").find("li").removeClass("displayNone").addClass("displayBlock");
          this.KarmaShowRequiredFileds["T14"]="Emergency Contact details shown";          
        }
      }

      /** Displaying Error in case required some more info of same pax and showing error on that case */
      var _this = this;
      var errors = [];

      if (this.data.regulatoryInPageErrors != null && typeof this.data.regulatoryInPageErrors == "string" && this.data.regulatoryInPageErrors.search(/greencard/i) != -1) {
        errors.push({
          "localizedMessage": _this.label.GreenCardReq
        });
        this.KarmaShowRequiredFileds["T28"].push("Green Card Required");
      }
      if (this.data.regulatoryInPageErrors != null) {
        errors.push({
          "localizedMessage": _this.label.MoreInfo
        });
        this.KarmaShowRequiredFileds["T28"].push("Some More Information Required for the pax");
      }
      /*For dynamically change other document details
       * Ex: to paremnent resident card as upon green card error CM usually requies it */

      if (this.hilightParticularOthDocType != null) {
        jQuery("#othdoctype").val(this.hilightParticularOthDocType);

        if(jQuery("#othdoctype option").length == 1)
        {
        	jQuery("#othdoctype").attr("disabled","disabled");
        }
      }

      if (errors != null && errors.length > 0) {
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        this.moduleCtrl.displayErrors(errors, "regulatoryErrors", "error");
      }
      this.data.regulatoryInPageErrors = null;
      this.hilightParticularOthDocType = null;
      /*End display error*/

      /*For edit button to show incase of edit nationlaity*/
      if (jQuery("#natokbutton").hasClass("disabled") && jQuery("#natokbutton").attr("disabled") == "disabled" && this.parameters.SITE_SSCI_ENABLE_NAT_EDIT.search(/true/i) != -1) {
        jQuery("#natokbutton").addClass("displayNone").next().removeClass("displayNone");
        this.KarmaShowRequiredFileds["T15"]="edit button shown incase of edit nationlaity";    
      }

      /*For showing dropdown to select required document to submit by user*/
        if (this.identityDocumentRequired != null && this.identityDocumentRequired.choices != null && this.identityDocumentRequired.choices != undefined && this.identityDocumentRequired.choices.length > 1 && this.identityDocumentRequired.type != null && this.identityDocumentRequired.type != undefined && this.identityDocumentRequired.type.search(/IdentityDocument/i) != -1) {
    	  jQuery(jQuery("#documentsRequiredDetails").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
          jQuery(jQuery("#documentsRequiredDetails").parents("section")[0]).children("ul").find("li").removeClass("displayNone").addClass("displayBlock");
          this.KarmaShowRequiredFileds["T16"]="Dropdown shown to select required document to submit by user"; 
          this.changeDocumentsRequiredDetails(null, {
            value: document.getElementById('documentsRequiredDetails').value
          });
        }
        this.identityDocumentRequired = null;
      /*End for showing dropdown to select required document to submit by user*/

       /*
        * For maximise nationality section incase there is only one section to show
        * */
        if(jQuery("#IDSectionHolder>section.displayBlock").length == 1 && jQuery("#IDSectionHolder>section:first-of-type.displayBlock header button[data-aria-expanded='false']").length == 1)
        {
        	jQuery("[data-aria-controls='natInfo01']").click();
        }

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in showRequiredFileds function', exception);
      }
    },
    /*
     * dest is an array for multiple fields
     * */
    prefillNationality: function(source, dest) {
      this.$logInfo('RequiredDetailsScript::Entering prefillNationality function');
      try {
        var countryListCodeMap = this.moduleCtrl.gettwoDigitThreeDigitAllCntryList();

        for (var i in dest) {
          if (jQuery("#" + source).length > 0 && jQuery("#" + dest[i]).length > 0 && !countryListCodeMap[jQuery("#" + dest[i]).val().toUpperCase()] && countryListCodeMap[jQuery("#" + source).val().toUpperCase()]) {
            jQuery("#" + dest[i]).val(jQuery("#" + source).val());
          }
        }

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in prefillNationality function', exception);
      }
    },

    /*
     * it will take care of
     *
     * display passport, edit nationality fields, other document details
     * */
    changeDocumentsRequiredDetails: function(event, id) {
      this.$logInfo('RequiredDetailsScript::Entering changeDocumentsRequiredDetails function');
      try {

        if (id.call != null) {
          id.value = event.target.getValue();
        }

        if (id.value == "othdoctype") {
          /*For showing hiding apropiate fields*/
          if (this.data.documentFileds.othFields.length == 0) {
        		jQuery(jQuery("#othdoctype").parents("section")[0]).children("ul").find("li").removeClass("displayNone").addClass("displayBlock");

          } else {
            for (var vf in this.data.documentFileds.othFields) {
              var tvf = this.data.documentFileds.othFields[vf];
              jQuery(jQuery("#othdoctype").parents("section")[0]).children("ul").find("li[data-fieldno='" + tvf + "']").removeClass("displayNone").addClass("displayBlock");
        		}

            	/*When oth section shown, docuemnt type shown always*/
            	jQuery(".othdoctype").removeClass("displayNone").addClass("displayBlock");
        	}
    		jQuery(jQuery("#othdoctype").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
        this.KarmaShowRequiredFileds["T17"]="Appropriately , Other Doc Types are shown";
        	/*End for showing hiding apropiate fields*/
        } else if (id.call != null) {
    		jQuery(jQuery("#othdoctype").parents("section")[0]).removeClass("displayBlock").addClass("displayNone");
            jQuery(jQuery("#othdoctype").parents("section")[0]).children("ul").find("li").removeClass("displayBlock").addClass("displayNone");
    	}

        if (id.value == "pspnumber") {
          /*For showing hiding apropiate fields*/
          if (this.data.documentFileds.pspFields.length == 0) {
            jQuery(jQuery("#pspnumber").parents("section")[0]).children("ul").find("li").removeClass("displayNone").addClass("displayBlock");
        		jQuery("#natedit0 li").not(":first-child").removeClass("displayNone").addClass("displayBlock");

          } else {
            for (var vf in this.data.documentFileds.pspFields) {
              var tvf = this.data.documentFileds.pspFields[vf];
              jQuery(jQuery("#pspnumber").parents("section")[0]).children("ul").find("li[data-fieldno='" + tvf + "']").removeClass("displayNone").addClass("displayBlock");

              /*For remove passport incase it is not required for particular flight
               * i.e in edit nationality passport details shown only if passport details already filled or
               *
               * passport details asked by check regulatory service and yet to fill
               **/
              jQuery("#natedit0 li[data-fieldno='" + tvf + "']").not(":first-child").removeClass("displayNone").addClass("displayBlock");
        			/*End*/
        		}
            }
        	jQuery(jQuery("#pspnumber").parents("section")[0]).removeClass("displayNone").addClass("displayBlock");
          this.KarmaShowRequiredFileds["T37"] = "PSP Fields shown";
        	/*End for showing hiding apropiate fields*/

        } else if (id.call != null) {
    		jQuery(jQuery("#pspnumber").parents("section")[0]).removeClass("displayBlock").addClass("displayNone");
            jQuery(jQuery("#pspnumber").parents("section")[0]).children("ul").find("li").removeClass("displayBlock").addClass("displayNone");

			 /*For remove passport incase it is not required for particular flight
             * i.e in edit nationality passport details shown only if passport details already filled or
             *
             * passport details asked by check regulatory service and yet to fill
             **/
              jQuery("#natedit0 li").not(":first-child").removeClass("displayBlock").addClass("displayNone");
            /*End*/
    	}

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in changeDocumentsRequiredDetails function', exception);
      }
    },

    datePicker: function(name, _this, rangeFlg) {
      this.$logInfo('RequiredDetailsScript::Entering datePicker function');
      try {
      var dateRange = new Date(this.currDate);
      var currentDate = new Date(this.currDate);
      var currMonth=parseInt(currentDate.getMonth())+1;
      currMonth=((currMonth < 10) ? "0" + currMonth : currMonth).toString();
      if (rangeFlg == "dob" || rangeFlg == "datIssue") {
        dateRange.setFullYear(dateRange.getFullYear() - 100);
        var minimDateForCal = dateRange;
        var maximDateForCal = 0;
        var defaultDepCal = +0;

        var rangeMonth=parseInt(dateRange.getMonth())+1;
        rangeMonth=((rangeMonth < 10) ? "0" + rangeMonth : rangeMonth).toString();
        /*current date is max*/
        $(_this).parent().find("input[type='date']").attr("max", currentDate.getFullYear() + "-" + currMonth + "-" + ((currentDate.getDate() < 10) ? "0" + currentDate.getDate() : currentDate.getDate()));
        /*range is min*/
        $(_this).parent().find("input[type='date']").attr("min", dateRange.getFullYear() + "-" + rangeMonth + "-" + ((dateRange.getDate() < 10) ? "0" + dateRange.getDate() : dateRange.getDate()));

      } else {
        dateRange.setFullYear(dateRange.getFullYear() + 100);
        var minimDateForCal = 0;
        var maximDateForCal = dateRange;
        var defaultDepCal = +0;

        var rangeMonth=parseInt(dateRange.getMonth())+1;
        rangeMonth=((rangeMonth < 10) ? "0" + rangeMonth : rangeMonth).toString();
        /*current date is min*/
        $(_this).parent().find("input[type='date']").attr("min", currentDate.getFullYear() + "-" + currMonth + "-" + ((currentDate.getDate() < 10) ? "0" + currentDate.getDate() : currentDate.getDate()));
        /*range is max*/
        $(_this).parent().find("input[type='date']").attr("max", dateRange.getFullYear() + "-" + rangeMonth + "-" + ((dateRange.getDate() < 10) ? "0" + dateRange.getDate() : dateRange.getDate()));
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

          /*For setting html5 date as soon as date change using datepicker*/
          $(_this).parent().find("input[type='date']").val(Year1 + "-" + Month1 + "-" + Day1);

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

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in datePicker function', exception);
      }

    },

    editNationality: function(evt) {
      this.$logInfo('RequiredDetailsScript::Entering editNationality function');
      try {

      evt.preventDefault();

      jQuery(".message.info").removeClass("displayBlock").addClass("displayNone");
      this.data.inNatEditScreen = true;

      /* For hiding all section to have nat edit section*/
      jQuery("#MRequiredDetails_A article span>section").removeClass("displayBlock").addClass("displayNone");
      jQuery("#nationalityEdit").removeClass("displayNone").addClass("displayBlock");

      /*For prefilling passport details of nationality incase of field blur*/
      var countryListCodeMap = this.moduleCtrl.gettwoDigitThreeDigitAllCntryList();
      jQuery(document).on("blur","#editnationality", function() {

        /*inorder to avoid page refresh happens when auto complete loads*/
        setTimeout(function() {

          /*passport issues authority not having corect nationality then updating passport nationality*/
          if (jQuery("#editpspissueath").length > 0 && !countryListCodeMap[jQuery("#editpspissueath").val().toUpperCase()] && countryListCodeMap[jQuery("#editnationality").val().toUpperCase()]) {
            jQuery("#editpspissueath").val(jQuery("#editnationality").val());
          }

          /*passport country not having correct nationality then updating country*/
          if (jQuery("#editpspissuecntry").length > 0 && !countryListCodeMap[jQuery("#editpspissuecntry").val().toUpperCase()] && countryListCodeMap[jQuery("#editnationality").val().toUpperCase()]) {
              jQuery("#editpspissuecntry").val(jQuery("#editnationality").val());
            }

        }, 300);


      });
      this.KarmaEditNationality["T29"]="Prefilling passport details of nationality incase of field blur";
      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in editNationality function', exception);
      }
    },
    onPrevious: function(evt) {
      this.$logInfo('RequiredDetailsScript::Entering onPrevious function');
      try {
      this.data.regPageLandingPaxIndex--;
      this.data.inNatEditScreen = false;
      this.$refresh();
      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in onPrevious function', exception);
      }
    },

    chooseSubmit: function(evt) {
      this.$logInfo('RequiredDetailsScript::Entering chooseSubmit function');
      try {

        evt.preventDefault();
      this.$logInfo('RequiredDetailsScript::Entering chooseSubmit function');
      jQuery('input').blur();
      jQuery(document).scrollTop("0");
      jQuery("#natErrors").disposeTemplate();
      jQuery("#regulatoryOtherErrors").html("");
      jQuery("#regulatoryErrors").disposeTemplate();
      //this.showOverlay(true);
      modules.view.merci.common.utils.MCommonScript.showMskOverlay(true);
      var form = jQuery("#MRequiredDetails_A");
      var errors = [];
      form.check(errors, true, this.errorStrings);
      this.validateDates(errors);
      this.validateStateDetails(errors);

      /*For validating country details*/
      var countryListCodeMap = this.moduleCtrl.gettwoDigitThreeDigitAllCntryList();
      var invalidCountryEntered = false;
      jQuery("input[dataCountrySel='select-country']").each(function(idx) {
        if (jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") == false && jQuery(jQuery(this).parentsUntil("section")[jQuery(this).parentsUntil("section").length - 1]).parent().hasClass("displayNone") == false) {
          if (!countryListCodeMap[this.value.toUpperCase()]) {
            invalidCountryEntered = true;
          } else {
            this.value = countryListCodeMap[this.value.toUpperCase()];
          }
        }
      });
      if (invalidCountryEntered) {
        errors.push({
          "localizedMessage": this.errorStrings[41001].localizedMessage,
          "code": this.errorStrings[41001].errorid
        });
        this.KarmaShowRequiredFileds["T18"]="Invalid Country Entered";


      }
      /*End of validating country details*/

      if (errors != null && errors.length > 0) {
        modules.view.merci.common.utils.MCommonScript.hideMskOverlay();
        jQuery('#overlayCKIN').hide();
        jQuery('#splashScreen').hide();
        jQuery('input').blur();
        this.moduleCtrl.displayErrors(errors, "regulatoryErrors", "error");
        return null;
      }
      /*Have all the name value pair of form including hidden one, not disabled one so only
		handling other document types*/
      jQuery("#othdoctype").removeAttr("disabled");
      var EditInput = form.serializeObject();
        jQuery("#othdoctype").attr("disabled", "disabled");

      /*Have to tak only one which required*/
      var valideditinput = {};
      for (var node in EditInput) {
        if (node == "gender") {
          if (jQuery(jQuery("[name='" + node + "']").parentsUntil("section")[jQuery("[name='" + node + "']").parentsUntil("section").length - 1]).parent().hasClass("displayNone") == false) {
            if (jQuery(jQuery("[name='gender']").parentsUntil("section")[jQuery("[name='gender']").parentsUntil("section").length - 1]).find('li').eq(0).hasClass("displayNone") == false) {
              valideditinput[node] = EditInput[node];
            }

          }
        } else {
          var tempSelector = jQuery(jQuery("[name='" + node + "']").parentsUntil("section")[jQuery("[name='" + node + "']").parentsUntil("section").length - 1]).parent();
          if (jQuery(jQuery("[name='" + node + "']").parentsUntil("section")[jQuery("[name='" + node + "']").parentsUntil("section").length - 1]).parent().hasClass("displayNone") == false && tempSelector.attr("id") != "nationalityEdit") {
            if (jQuery(jQuery("[name='" + node + "']").parentsUntil("ul")[jQuery("[name='" + node + "']").parentsUntil("ul").length - 1]).hasClass("displayNone") == false) {
              //For country to take 2 digit code
              if (jQuery("[name='" + node + "']").attr("datacountrysel") != null && jQuery("[name='" + node + "']").attr("datacountrysel") != undefined) {
                valideditinput[node] = this.data.convertToTwoDigitForSendtoBackend[EditInput[node]];
              }
              //For State to take 2 digit code
              else if (jQuery("[name='" + node + "']").attr("datastatesel") != null && jQuery("[name='" + node + "']").attr("datastatesel") != undefined) {
                /*To check usa or not, the country details*/
                if (jQuery("[name='" + node + "']").parentsUntil("li").eq(jQuery("[name='" + node + "']").parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^usa$/ig) != -1 || jQuery("[name='" + node + "']").parentsUntil("li").eq(jQuery("[name='" + node + "']").parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^us$/ig) != -1 || jQuery("[name='" + node + "']").parentsUntil("li").eq(jQuery("[name='" + node + "']").parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^UNITED STATES OF AMERICA$/ig) != -1) {
                  valideditinput[node] = this.data.usaStatesCodeToStateNameMap[EditInput[node].toUpperCase()];
                } else {
                  valideditinput[node] = EditInput[node];
                }
              } else {
                valideditinput[node] = EditInput[node];
              }

            }

          }
          this.KarmaChooseSubmit["T30"] = "For storing all the valideditinput";
          /*For edit nationality nodes to make proper */
          if (tempSelector.hasClass("displayNone") == false && tempSelector.attr("id") == "nationalityEdit") {

            if (jQuery(jQuery("[name='" + node + "']").parentsUntil("ul")[jQuery("[name='" + node + "']").parentsUntil("ul").length - 1]).hasClass("displayNone") == false) {

              //For country to take 2 digit code
              if (jQuery("[name='" + node + "']").attr("datacountrysel") != null && jQuery("[name='" + node + "']").attr("datacountrysel") != undefined) {
                valideditinput[node.substr(4, node.length)] = this.data.convertToTwoDigitForSendtoBackend[EditInput[node]];
              } else {
                valideditinput[node.substr(4, node.length)] = EditInput[node];
              }

              valideditinput["nat_upd_data"] = true;
            }
          }

        }

      }

      /*
       * incase declineEmergencyConactDetails not there in valideditinput and emgrcontactname there in valideditinput which means Decline emergency contact details
       *
       * set to no, this happens because serializeobject wont list if checkbox is not checked
       * so adding it externally
       * */
        if (valideditinput["declineEmergencyConactDetails"] == undefined && valideditinput["emgrcontactname"] != undefined) {
          valideditinput["declineEmergencyConactDetails"] = "no";
        } else if (valideditinput["declineEmergencyConactDetails"] == "yes") {
          valideditinput["emgrcontactname"] = "";
          valideditinput["emgrcontrycode"] = "";
          valideditinput["emgrtelnumbr"] = "";
      }

      console.log(JSON.stringify(EditInput));
      console.log(JSON.stringify(valideditinput));
      this.moduleCtrl.editRegulatory({
        "editInput": valideditinput
      });

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in chooseSubmit function', exception);
      }

    },

    validateStateDetails: function(errors) {
      this.$logInfo('RequiredDetailsScript::Entering validateStateDetails function');
      try {

      /*For validating country details*/
      var stateListCodeMap = this.data.usaStatesCodeToStateNameMap;
      var invalidStateEntered = false;
      jQuery("input[datastatesel='select-state']").each(function(idx) {
        if (jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") == false && jQuery(jQuery(this).parentsUntil("section")[jQuery(this).parentsUntil("section").length - 1]).parent().hasClass("displayNone") == false) {

          /*To check usa or not, the country details*/
          if (jQuery(this).parentsUntil("li").eq(jQuery(this).parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^usa$/ig) != -1 || jQuery(this).parentsUntil("li").eq(jQuery(this).parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^us$/ig) != -1 || jQuery(this).parentsUntil("li").eq(jQuery(this).parentsUntil("li").length - 1).parent().next().next().find('input[type="text"]').val().search(/^UNITED STATES OF AMERICA$/ig) != -1) {
            if (!stateListCodeMap[this.value.toUpperCase()]) {
              invalidStateEntered = true;
            } else {
              /*If usa and value only 2 digit then it is abrvation change to state name*/
              if (this.value.length == 2) {
                this.value = stateListCodeMap[this.value.toUpperCase()];
              }

            }

          }
        }
      });
      if (invalidStateEntered) {
        errors.push({
          "localizedMessage": "Please enter a valid state name or select one from the list."
        });
        this.KarmaShowRequiredFileds["T19"]="Please enter a valid state name or select one from the list.";
      }
      /*End of validating country details*/
      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in validateStateDetails function', exception);
      }
    },

    // Function called to validate the dates entered
    validateDates: function(errors) {
      this.$logInfo('RequiredDetailsScript::Entering validateDates function');
      try {
      var _this = this;

      $("[val*='dob']").each(function() {
        if (jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") == false && jQuery(jQuery(this).parentsUntil("section")[jQuery(this).parentsUntil("section").length - 1]).parent().hasClass("displayNone") == false) {
          var date = $(this).val();
          var pax_type = $(this).attr('pax');
          var dateArray = date.split("-");
          _this.checkDOB(
            _this, errors, {
              year: dateArray[0],
              month: dateArray[1],
              day: dateArray[2],
              pax: pax_type
            }
          );

        }
      });
      $("[val*='datIssue']").each(function() {
          if (jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") == false && jQuery(jQuery(this).parentsUntil("section")[jQuery(this).parentsUntil("section").length - 1]).parent().hasClass("displayNone") == false) {
            var date = $(this).val();
            var pax_type = $(this).attr('pax');
            var dateArray = date.split("-");
            _this.checkDatIssue(
              _this, errors, {
                year: dateArray[0],
                month: dateArray[1],
                day: dateArray[2],
                pax: pax_type,
                headerLabl: $(this).attr("data-errLbl")
              }
            );

          }
        });
      $("[val*='ed']").each(function() {
        if (jQuery(jQuery(this).parentsUntil("ul")[jQuery(this).parentsUntil("ul").length - 1]).hasClass("displayNone") == false && jQuery(jQuery(this).parentsUntil("section")[jQuery(this).parentsUntil("section").length - 1]).parent().hasClass("displayNone") == false) {
          var date = $(this).val();
          var doc = $(this).attr('doc');
          var dateArray = date.split("-");
          _this.checkED(
            _this, errors, {
              year: dateArray[0],
              month: dateArray[1],
              day: dateArray[2],
              doc: doc
            }
          );
        }
      });

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in validateDates function', exception);
      }
    },

    // This function is used to validate the expiry date of documetns like passport, visa
    checkED: function(evt, errors, args) {
      this.$logInfo('RequiredDetailsScript::Entering checkED function');
      try {
      var newmonth;
      if (args.doc == "passport") {
        if (parseInt(this.parameters.SITE_SSCI_PSPT_EXP_DUR, 10))
          newmonth = this.__data.date.curMonth + 1 + parseInt(this.parameters.SITE_SSCI_PSPT_EXP_DUR, 10);
        else
          newmonth = this.__data.date.curMonth + 1 + 0;
      }
      if (args.doc == "visa") {
        if (parseInt(this.parameters.SITE_SSCI_VISA_EXP_DUR, 10))
          newmonth = this.__data.date.curMonth + 1 + parseInt(this.parameters.SITE_SSCI_VISA_EXP_DUR, 10);
        else
          newmonth = this.__data.date.curMonth + 1 + 0;
      }
      if (args.doc == "otherdocument") {
        if (parseInt(this.parameters.SITE_SSCI_OTHDOC_EXP_DUR, 10))
          newmonth = this.__data.date.curMonth + 1 + parseInt(this.parameters.SITE_SSCI_OTHDOC_EXP_DUR, 10);
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
      this.KarmaCheckED["T34"] = flag;
      /*PTR 08048839 [Medium]: SQ mob-UAT-R15-MCI: The DOB and DOE should not be defaulted to current date*/
      if (flag == 1 || flag == 2) {
        if (args.doc == "passport") {
          if (flag == 2) {
            errors.push({
              "localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage, [this.label.PassportInfo + " - " + this.label.ExpDate]),
              "code": this.errorStrings[21400059].errorid
            });

            this.KarmaCheckED["T31"]="Passport This field is mandatory.";
            return;
          } else {
            errors.push({
              "localizedMessage": this.errorStrings[25000002].localizedMessage,
              "code": this.errorStrings[25000002].errorid
            });
          }
            this.KarmaCheckED["T31"] = "Expiry Date for passport can not be today or past date.";
        }
        if (args.doc == "visa") {
          if (flag == 2) {
            errors.push({
              "localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage, [this.label.VisaInfo + " - " + this.label.ExpDate]),
              "code": this.errorStrings[21400059].errorid
            });
            this.KarmaCheckED["T32"]="Visa This field is mandatory.";
            return;
          } else {
            errors.push({
              "localizedMessage": this.errorStrings[25000003].localizedMessage,
              "code": this.errorStrings[25000003].errorid
            });
            this.KarmaCheckED["T32"]="Expiry Date for visa can not be today or past date.";
          }

        }
        if (args.doc == "otherdocument") {
          if (flag == 2) {
            errors.push({
              "localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage, [this.label.OtherDocInfo + " - " + this.label.DocExpDate]),
              "code": this.errorStrings[21400059].errorid
            });
            this.KarmaCheckED["T33"]="Otherdocument This field is mandatory.";
            return;
          } else {
            errors.push({
              "localizedMessage": this.errorStrings[25000004].localizedMessage,
              "code": this.errorStrings[25000004].errorid
            });
            this.KarmaCheckED["T33"]="Expiry Date for other document can not be today or past date.";
          }

        }
        return;
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
            "localizedMessage": jQuery.substitute(this.errorStrings[213001069].localizedMessage, this.parameters.SITE_SSCI_PSPT_EXP_DUR),
            "code": this.errorStrings[213001069].errorid
          });
        }
        if (args.doc == "visa") {
          //var expParam = parseInt(this.parameters.SITE_MCI_MIN_EXPRY_VIS,10) ? parseInt(this.parameters.SITE_MCI_MIN_EXPRY_VIS,10) : 0 ;
          errors.push({
            "localizedMessage": jQuery.substitute(this.errorStrings[213002100].localizedMessage, this.parameters.SITE_SSCI_VISA_EXP_DUR),
            "code": this.errorStrings[213002100].errorid
          });
        }
        if (args.doc == "otherdocument") {
          //var expParam = parseInt(this.parameters.SITE_MCI_MIN_EXPRY_OTH,10) ? parseInt(this.parameters.SITE_MCI_MIN_EXPRY_OTH,10) : 0 ;
          errors.push({
            "localizedMessage": jQuery.substitute(this.errorStrings[213002101].localizedMessage.substring(1), this.parameters.SITE_SSCI_OTHDOC_EXP_DUR),
            "code": this.errorStrings[213002101].errorid
          });
        }
      }this.KarmaCheckED["T20"]="Passenger with WCHR SSR restricted to check-in alone";
      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in checkED function', exception);
      }
    },

    /*
     * For checking psp, visa, other doc issueing date. issue date should be less than current date
     * */
    checkDatIssue: function(evt, errors, args) {
      this.$logInfo('RequiredDetailsScript::Entering checkDatIssue function');
      try {
        var dCurr = new Date(this.currDate);
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
            "localizedMessage": jQuery.substitute(this.errorStrings[21400059].localizedMessage, [args.headerLabl + " - " + this.label.issueDate]),
            "code": this.errorStrings[21400059].errorid
          });
           this.KarmaCheckDatIssue["T34"]="Years This field is mandatory.";
          return;
        }

        if (flag == 1) {
        	errors.push({
                "localizedMessage": jQuery.substitute(this.errorStrings[213002300].localizedMessage, [args.headerLabl + " - " + this.label.issueDate]),
                "code": this.errorStrings[213002300].errorid
              });
          this.KarmaCheckDatIssue["T35"]="Year can not be today or future date.";
        }
      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in checkDatIssue function', exception);
      }

    },

    // This function is used to validate the date of birth for adult, child and infant
    checkDOB: function(evt, errors, args) {
      this.$logInfo('RequiredDetailsScript::Entering checkDOB function');
      try {

      var dCurr = new Date(this.currDate);
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
        this.KarmacheckDOB["T36"]="Year This field is mandatory.";
        return;
      }

      if (flag == 1) {
        errors.push({
          "localizedMessage": this.errorStrings[25000008].localizedMessage,
          "code": this.errorStrings[25000008].errorid
        });
        this.KarmacheckDOB["T36"]="Date of Birth can not be today or future date.";
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
        var daysParameter = parseInt(this.parameters.SITE_SSCI_REG_INF_MIN_AGE, 10) ? parseInt(this.parameters.SITE_SSCI_REG_INF_MIN_AGE, 10) : 0;; //parseInt(this.parameters.SITE_MCI_MIN_AGE_INF_DAY,10) ? parseInt(this.parameters.SITE_MCI_MIN_AGE_INF_DAY,10) : 0;
        var infMonths = parseInt(this.parameters.SITE_SSCI_REG_INF_MAX_AGE, 10) ? parseInt(this.parameters.SITE_SSCI_REG_INF_MAX_AGE, 10) : 0;; //parseInt(this.parameters.SITE_MCI_MAX_AGE_INF_YRS,10) ? parseInt(this.parameters.SITE_MCI_MAX_AGE_INF_YRS,10) : 0;

        if (infMonths != 0) {
          if (!(days >= daysParameter && (years * 12) < infMonths)) {
            errors.push({
              "localizedMessage": jQuery.substitute(this.errorStrings[213002290].localizedMessage, [daysParameter, infMonths]),
              "code": this.errorStrings[213002290].errorid
            });
             this.KarmacheckDOB["T21"]="Please select valid Date of Birth. For infant it should be between {0} days and {1} months.";
          }
        }
      }
      if (args.pax == "child") {
        var childAgeMinParam = parseInt(this.parameters.SITE_SSCI_REG_CHD_MIN_AGE, 10) ? parseInt(this.parameters.SITE_SSCI_REG_CHD_MIN_AGE, 10) : 0;; //parseInt(this.parameters.SITE_MCI_MIN_AGE_CHLD,10) ? parseInt(this.parameters.SITE_MCI_MIN_AGE_CHLD,10) : 0;
        var childAgeMaxParam = parseInt(this.parameters.SITE_SSCI_REG_CHD_MAX_AGE, 10) ? parseInt(this.parameters.SITE_SSCI_REG_CHD_MAX_AGE, 10) : 0;; //parseInt(this.parameters.SITE_MCI_MAX_AGE_CHLD,10) ? parseInt(this.parameters.SITE_MCI_MAX_AGE_CHLD,10) : 0;
        if (childAgeMaxParam != 0) {
          if (!(years >= childAgeMinParam && years < childAgeMaxParam)) {
            errors.push({
              "localizedMessage": jQuery.substitute(this.errorStrings[213002103].localizedMessage, [childAgeMinParam, childAgeMaxParam]),
              "code": this.errorStrings[213002103].errorid
            });
            
            this.KarmacheckDOB["T22"]="Please select valid Date of Birth. For child it should be between {0} to {1} years.";
          }
        }
      }
      if (args.pax == "adult") {

        var minorAgeLmtParam = parseInt(this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) ? parseInt(this.parameters.SITE_SSCI_MINOR_AGE_LIMIT, 10) : 0;

        if (!(years >= minorAgeLmtParam)) {
          errors.push({
            "localizedMessage": jQuery.substitute(this.errorStrings[213001074].localizedMessage, minorAgeLmtParam),
            "code": this.errorStrings[213001074].errorid
          });
          this.KarmacheckDOB["T23"]="Please select valid Date of Birth. For adult it should be more than {0} years.";
        }
      }

      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in checkDOB function', exception);
      }

    },

    /**
     * onModuleEvent : Module event handler called when a module event is raised.
     */
    onModuleEvent: function(evt) {
      try {
        this.$logInfo('RequiredDetailsScript::Entering onModuleEvent function');

        switch (evt.name) {
          case "page.callDisplayFieldsOnLoad":

            break;
          case "page.refresh":
            this.$refresh();
            break;
        }
      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in onModuleEvent function', exception);
      }
    },

    onBackClick: function() {
      this.$logInfo('RequiredDetailsScript::Entering onBackClick function');
      try {
      this.moduleCtrl.onBackClick();
      } catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in onBackClick function', exception);
      }
    },

    onHomeClick: function(evt) {
		try {
        this.$logInfo('RequiredDetailsScript::Entering onHomeClick function');
			if (this.moduleCtrl.getEmbeded()) {
				window.location = "sqmobile" + "://?flow=MCI/exitCheckIn";
			} else {
				jQuery("#convertCodeToSimbol").html(
					this.parameters.LANG_MCI_HOMEPAGE_URL);
				window.location = jQuery("#convertCodeToSimbol")
					.text();

			}
		} catch (exception) {
        this.$logError('RequiredDetailsScript::An error occured in onHomeClick function', exception);
		}
    },
    copyFromOtherPaxDestDetal: function(event,args){
    	try {
            this.$logInfo('RequiredDetailsScript::Entering copyFromOtherPaxDestDetal function');

            document.querySelector("#destaddrstreet").value=this.data.regDestDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].street;
            document.querySelector("#destaddrcity").value=this.data.regDestDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].city;
            document.querySelector("#destaddrstate").value=this.data.regDestDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].state;
            document.querySelector("#destaddrzip").value=this.data.regDestDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].postal;
            document.querySelector("#destaddrcuntry").value=this.data.regDestDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].country;

          } catch (exception) {
            this.$logError('RequiredDetailsScript::An error occured in copyFromOtherPaxDestDetal function', exception);
          }
    },
    copyFromOtherPaxHomeDetal: function(event,args){
    	try {
            this.$logInfo('RequiredDetailsScript::Entering copyFromOtherPaxHomeDetal function');

            document.querySelector("#homeaddrstreet").value=this.data.regHomeDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].street;
            document.querySelector("#homeaddrcity").value=this.data.regHomeDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].city;
            document.querySelector("#homeaddrstate").value=this.data.regHomeDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].state;
            document.querySelector("#homeaddrzip").value=this.data.regHomeDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].postal;
            document.querySelector("#homeaddrcuntry").value=this.data.regHomeDetailsAutocomplete[args.input.fromField][document.querySelector("#"+args.input.id).value].country;

          } catch (exception) {
            this.$logError('RequiredDetailsScript::An error occured in copyFromOtherPaxHomeDetal function', exception);
          }
    }
  }
});