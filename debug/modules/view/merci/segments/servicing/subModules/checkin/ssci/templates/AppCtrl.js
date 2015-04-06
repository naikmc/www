  /* --------------------------------------------------------------------------------*/
/*                      CHECKIN.APPCTRL - MAIN JAVASCRIPT                            */
/* --------------------------------------------------------------------------------*/

Aria.classDefinition({
  	$classpath: 'modules.view.merci.segments.servicing.subModules.checkin.ssci.templates.AppCtrl',
  	$dependencies: [],
  	$constructor: function(devMode) {

    this._controller = null;
    //this._controllerPrivate = null;
    this._init = true; /* true while initializing the page. */
    this._refresh = false;
  },

  $prototype: {

    /*
     * function: init
     * This function init the checkin index page.
     *
     * parameters:
     *  - checkin module controller.
     * return:
     *  - none.
     * TODO code of this controller should be moved to Checkin module controller
     */
  		init: function(moduleCtrl) {
      try {
        this.$logInfo('AppCtrl::Entering init function');
        this._controller = moduleCtrl;
        this._refresh = true;
      } catch (exception) {
        this.$logError('AppCtrl::An error occured in init function', null, exception);
      }
    },

    /*
      * load :
      * This function is a wrapper of history to load hash
      * URLs.
      *
      * parameters: - path : the path to load in history.
      *             - errors : errors to stored if any
      * return: - none.
    */
  		load: function(path, errors) {
      try {
        this.$logInfo('AppCtrl::Entering load function');
        //this.__errors = errors;
        //var state = jQuery.history.appState;
        //if (path != state) {
          /*Try to load a diffrenet hash than the current one*/
          //jQuery.history.load(path);
        //} else {
          /*Load the same hash, will ultimatelly request a refresh */
          //this._controller.updateLayout(path, this.__errors);
        //}
         this._controller.navigate(null, path);
      } catch (exception) {
        this.$logError(
            'AppCtrl::An error occured in load function',
            exception);
      }
    },


    /**
      * onHistoryCallback :
      * This function is called by the jQuery history pluggin to init
      * and when new path is loaded.
      *
      * parameters:
      *  - hash : the value of the hash to load.
      * return:
      *  - none.
    */
  		onHistoryCallback: function(hash) {
      try {
        this.$logInfo('AppCtrl::Entering onHistoryCallback function');

          if (!jQuery.isBlank(hash)) {
            var params = hash.split("/");
            if (!jQuery.isEmpty(params)) {
              var module = params.shift();
              var action = params.shift();
              switch (action) {
  							default: this._controller.updateLayout(hash, this.__errors);
                  break;
              }
            }
  				} else {
            this.load("checkin/home");
          }

      } catch (exception) {
        this.$logError(
          'AppCtrl::An error occured in onHistoryCallback function',
            exception);
      }
    },

     /*
     * Register globaly an handler
     * parameters :
     * - the function which will be called when the event will occur
     * - the scope of the function
     */
  		registerHandler: function(fn, context) {
      try {
        this.$logInfo('AppCtrl::Entering registerHandler function');
        var ts = jQuery.now();
  				var random = Math.ceil(Math.random() * 100);
  				var handlerName = 'handler' + ts + random;
  				var additionalArgs = Array.prototype.slice.call(arguments, 2);
        var _this = this;
  				window[handlerName] = function() {
          try {
  						_this.$logInfo('AppCtrl::Entering registerHandler::' + handlerName + ' function');
            var args = Array.prototype.slice.call(arguments);
            fn.apply(context, args.concat(additionalArgs));
            return false;
          } catch (exception) {
            _this.$logError(
  							'AppCtrl::An error occured in registerHandler::' + handlerName + ' function',
                exception);
          }
        };
        return handlerName;
      } catch (exception) {
        this.$logError(
            'AppCtrl::An error occured in registerHandler function',
            exception);
      }
  		},

  		loadNewUIScriptFunctions: function() {

  			console.log("New ui scripts got loaded from app atrl");

  			/*
  			 * Added to change expand and collapse according to new CSS
  			 * */
  			$(document).on("click",".sectionDefaultstyle *[role=button][data-aria-expanded]", function() {

  				if ($(this).attr("id") && $(this).attr("id") != "declineEmergencyConactDetails") {
  					return false;
  				}

  				var controls = "#" + $(this).attr('data-aria-controls').replace(/ /g, ',#');
  				var value = $(this).attr('data-aria-expanded');
  				if (value == "true") {
  					val = "false";
  				} else {
  					val = "true";
  				}
  				$(this).attr('data-aria-expanded', val);
  				$(this).attr('data-aria-hidden', value);

  				if (val == "true") {
  					$(controls).animate({
  						height: "show"
  					}, {
  						duration: "fast",
  						easing: "swing"
  					}, function() {
  						// Animation complete.
  					});

  					/*
  					 * along with above animate function which style="display:none or  block " accordinglly we r adding below one
  					 * because we are doing some functionality based on class displayNone or displayBlock
  					 *
  					$(controls).removeClass("displayNone").addClass("displayBlock");
  					*/

  					/*
  					 * this is to make li display none
  					 *
  					 * only for regulatory page in case Decline emergency contact details yes no
  					 *
  					 *  only to make error message to show properly
  					 *
  					 * */
  					if($(this).attr("id") == "declineEmergencyConactDetails")
  					{
  						$(controls+">li").removeClass("displayNone").addClass("displayBlock");
  					}

  				} else {
  					$(controls).animate({
  						height: "hide"
  					}, {
  						duration: "fast",
  						easing: "swing"
  					}, function() {
  						// Animation complete.
  					});

  					/*
  					 * along with above animate function which ass style="display:none or  block " accordinglly we r adding below one
  					 * because we are doing some functionality based on class displayNone or displayBlock
  					 *
  					$(controls).removeClass("displayBlock").addClass("displayNone");
  					*/

  					/*
  					 * this is to make li display none
  					 *
  					 * only for regulatory page in case Decline emergency contact details yes no
  					 *
  					 *  only to make error message to show properly
  					 *
  					 * */
  					if($(this).attr("id") == "declineEmergencyConactDetails")
  					{
  						$(controls+">li").removeClass("displayBlock").addClass("displayNone");
  					}
  				}

  			});

  			/*Currosal code start*/

  			find_NumberDisabled_left = "left";
  			find_NumberDisabled_right = "";
  			find_header_page = "";
  			/*
  			 * find_header_page -- 1 Nationality
  			 * find_header_page -- 2 Seatmap
  			 * */
  			displayNumbers = function() {

  				var buttonsText = $('.carrousel-header a span');

  				if (find_header_page == 1) {
  					var paxNumber = jQuery(".nationality").length;
  				} else if (find_header_page == 2) {
  					var paxNumber = jQuery(".seatmapPaxDetails").length;
  				}

  				var buttonLeft = $('.carrousel-header a').eq(0);
  				var buttonRight = $('.carrousel-header a').eq(1);

  				var buttonTextLeft = $('.carrousel-header a').eq(0).find('span');
  				var buttonTextRight = $('.carrousel-header a').eq(1).find('span');

  				var numberLeft = parseInt(buttonsText.eq(0).attr('data-paxnr'));
  				var numberRight = parseInt(buttonsText.eq(1).attr('data-paxnr'));

  				if (numberLeft > 0) {

  					find_NumberDisabled_left = "";
  					buttonTextLeft.text(numberLeft);
  					if (buttonLeft.hasClass('is-disabled')) {
  						buttonLeft.removeClass('is-disabled');
  					}
  				} else {

  					buttonTextLeft.text("");
  					buttonLeft.addClass('is-disabled');
  					find_NumberDisabled_left = "left";
  				}

  				if (numberRight <= paxNumber) {

  					find_NumberDisabled_right = "";
  					buttonTextRight.text(numberRight);
  					if (buttonRight.hasClass('is-disabled')) {
  						buttonRight.removeClass('is-disabled');
  					}
  				} else {

  					buttonTextRight.text("");
  					buttonRight.addClass('is-disabled');
  					find_NumberDisabled_right = "right";
  				}

  				if (paxNumber == 1) {
  					buttonRight.addClass('is-disabled');
  					find_NumberDisabled_right = "right";
  				}


  			}

  			/* ////////////// Carrousel /////////// */

  			mousePositionX = null;
  			itemCounter = 0;
  			is_clickedOn_list = -1;
  			itemWidth = null;

  			$(window).resize(function() {
  				positionCarrouselForResize($('.carrousel-full'));
  				//itemCounter = 0;
  				//lightSelectedUp();
  				//changeTitle();
  			});

  			$(document).on("mousemove",'.sectionDefaultstyle .carrousel-full', function(event) {
  				mousePositionX = event.pageX;
  			});
  			positionCarrouselForResize = function(which) {
  				var containerWidth = which.width();
  				itemWidth = which.children('ul').children('li').outerWidth(true) + 4; /*inline-block generates 4px invisible margin. To be checked in all browsers*/
  				var position = (containerWidth / 2) - (itemWidth / 2) - (itemCounter*itemWidth) ;
  				which.children('ul').css("left", position);
  			}

  			positionCarrousel = function(which) {
  				var containerWidth = which.width();
  				itemWidth = which.children('ul').children('li').outerWidth(true) + 4; /*inline-block generates 4px invisible margin. To be checked in all browsers*/
  				var position = (containerWidth / 2) - (itemWidth / 2);
  				which.children('ul').css("left", position);
  			}

  			$(document).on("click",'.sectionDefaultstyle .carrousel-full li', function() {

  				is_clickedOn_list = $(this).index();

  			});

  			$(document).on("click",'.sectionDefaultstyle .carrousel-full h1', function() {


  				is_clickedOn_list = $('.carrousel-full-item.is-selected').parent('li').index();

  			});

  			moveCarrousel_left = function(which_ul) {
  				(function() {
  					itemCounter += 1;
  					lightSelectedUp("left");
  					changeTitle();
  					which_ul.next('footer').find('li').eq(itemCounter - 1).removeClass('is-selected');
  					which_ul.next('footer').find('li').eq(itemCounter).addClass('is-selected');
  					which_ul.animate({
  						left: '-=' + itemWidth + 'px'
  					}, 250, function() {

  					});
  				}());

  			}

  			moveCarrousel_right = function(which_ul) {
  				(function() {
  					itemCounter -= 1;
  					lightSelectedUp("right");
  					changeTitle();
  					which_ul.next('footer').find('li').eq(itemCounter + 1).removeClass('is-selected');
  					which_ul.next('footer').find('li').eq(itemCounter).addClass('is-selected');
  					which_ul.animate({
  						left: '+=' + itemWidth + 'px'
  					}, 250, function() {

  					});
  				}());

  			}

  			eventItem = "";
  			lightSelectedUp = function(val) {

  				$('.carrousel-full-item').attr(eventItem, "");

  				if (val == undefined) {
  					itemCounter = 0;
  					jQuery("#listboxa>li").eq(itemCounter).find("article").attr(eventItem, jQuery("#listboxa>li").eq(itemCounter).find("article").attr("data-airp-list-onclick"));
  				}

  				$('.carrousel-full-item').removeClass('is-selected');
  				$('.carrousel-full').children('ul').children('li').eq(itemCounter).find('.carrousel-full-item').addClass('is-selected');

  				if (val == "left") {
  					jQuery("#listboxa>li").eq(itemCounter).find("article").attr(eventItem, jQuery("#listboxa>li").eq(itemCounter).find("article").attr("data-airp-list-onclick"));
  				} else if (val == "right") {
  					jQuery("#listboxa>li").eq(itemCounter).find("article").attr(eventItem, jQuery("#listboxa>li").eq(itemCounter).find("article").attr("data-airp-list-onclick"));
  				}

  			}

  			changeTitle = function() {

  				var widthOfTitle;
  				if ($('.carrousel-full-item.is-selected').parent('li').hasClass('multicity')) {
  					widthOfTitle = '95%';
  				} else if ($('.carrousel-full-item.is-selected').parent('li').hasClass('one-way')) {
  					widthOfTitle = '50%';
  				} else if ($('.carrousel-full-item.is-selected').parent('li').hasClass('boardingindex')) {
  					widthOfTitle = '80%';
  				} else {
  					widthOfTitle = '60%';
  				}
  				widthOfTitle = '95%';

  				var airportOrigin = $('.carrousel-full-item.is-selected').attr('data-airp-points');

  				var titleComplete = airportOrigin;
  				if (!hideBoardinglistheaderRtarro) {
  					var titleComplete = airportOrigin + " " + "<a href='javascript:void(0)' class='more-info'></a>";
  				}


  				$('.carrousel-full').children('h1').attr(eventItem, jQuery("#listboxa .is-selected").attr("data-airp-list-onclick"));

  				$('.carrousel-full').children('h1').animate({
  					width: widthOfTitle,
  					opacity: 0.25
  				}, 400, function() {
  					// Animation complete.
  					$(this).html(titleComplete);
  					$('.carrousel-full').children('h1').animate({
  						width: widthOfTitle,
  						opacity: 1
  					}, 500, function() {
  						// Animate;
  					});
  				});


  			}

  			/* ////////////// End Carrousel /////////// */

  			/* ADDED FOR PAX SELECTION AND FLIGHT SELECTION PAGE */

  			anyCheckbox = $('.sectionDefaultstyle ul.checkin-list input[type="checkbox"]');

  			checkBoxPax = $('.sectionDefaultstyle ul.checkin-list[data-info="pax-list"] input[type="checkbox"]');
  			checkBoxFlight = $('.sectionDefaultstyle ul.checkin-list[data-info="flights-ready-list"] input[type="checkbox"]');
  			checkBoxDAG = $('.sectionDefaultstyle ul.checkin-list[data-info="dangerous-goods"] input[type="checkbox"]');

  			addedPax = [];
  			addedImgs = [];


  			$(document).on("change",anyCheckbox.selector, function() {
  				if ($(this).is(':checked')) {
  					$(this).parent('li').addClass('is-checked');
  				} else {
  					$(this).parent('li').removeClass('is-checked');
  				}
  			});


  			$(document).on("change",checkBoxPax.selector, function() {

  				var checkedPaxName = $(this).val();
  				var checkedPaxNameImage = $(this).siblings('label').children('img').attr('src');

  				if ($(this).is(':checked')) {
  					addPaxInFlights(checkedPaxName, checkedPaxNameImage);
  				} else {
  					removePaxInFlights(checkedPaxName);
  				}

  				checkIfenableNavigation();
  			});



  			addPaxInFlights = function(which_pax, which_image) {
  				var paxToAdd = which_pax;
  				var paxToAddImageUrl = which_image;
  				var htmlToAdd = "<li class='pax'><img src='" + paxToAddImageUrl + "'/>" + paxToAdd + "</li>";

  				if (addedPax.indexOf(paxToAdd) == -1) {
  					$('ul[data-info="pax-sub-list"]').append(htmlToAdd);
  					$('ul[data-info="pax-sub-list"]').siblings('div.message').addClass('hidden');

  					addedPax.push(paxToAdd);
  					addedImgs.push(paxToAddImageUrl);
  				}
  			}

  			removePaxInFlights = function(which_pax) {
  				var paxToRemove = which_pax;


  				if (addedPax.indexOf(paxToRemove) != -1) {
  					var which_index = addedPax.indexOf(paxToRemove);
  					addedPax.splice(which_index, 1);
  					addedImgs.splice(which_index, 1);
  					$('ul[data-info="pax-sub-list"]').empty();

  					addedPax.forEach(function(entry) {
  						var indexOfPaxLeft = addedPax.indexOf(entry);

  						var paxToAdd = entry;
  						var paxToAddImageUrl = addedImgs[indexOfPaxLeft];
  						var htmlToAdd = "<li class='pax'><img src='" + paxToAddImageUrl + "'/>" + paxToAdd + "</li>";

  						$('ul[data-info="pax-sub-list"]').append(htmlToAdd);
  					});
  				}
  				checkIfEmpty($('ul[data-info="flights-ready-list"] li.is-checked input[type="checkbox"]'));
  			}



  			$(document).on("change",checkBoxFlight.selector, function() {

  				checkIfEmpty($(this));
  				checkIfenableNavigation();

  			});

  			checkIfEmpty = function(where) {

  				var listToCheck = where.siblings('ul[data-info="pax-sub-list"]').children('li.pax').html();


  				if (listToCheck === null) {
  					if (where.is(':checked')) {
  						where.siblings('div.message').removeClass('hidden');
  					} else {
  						where.siblings('div.message').addClass('hidden');
  					}

  				}
  			}



  			checkIfenableNavigation = function(buttonRef) {

  				var buttonToEnable = buttonRef ? buttonRef : $('footer.buttons button').not(".cancel").eq(0);

  				if (checkBoxPax.is(':checked')) {

  					if (checkBoxFlight.width() === null) {
  						buttonToEnable.removeClass('disabled');
  						buttonToEnable.removeAttr("disabled");
  					} else {
  						if (checkBoxFlight.is(':checked')) {
  							buttonToEnable.removeClass('disabled');
  							buttonToEnable.removeAttr("disabled");
  						} else {
  							buttonToEnable.addClass('disabled');
  							buttonToEnable.attr("disabled", "disabled");
  						}
  					}
  				} else {
  					buttonToEnable.addClass('disabled');
  					buttonToEnable.attr("disabled", "disabled");
  				}


  				if (jQuery(checkBoxPax.selector).width() === null) {
  					if (jQuery(checkBoxFlight.selector).is(':checked')) {
  						buttonToEnable.removeClass('disabled');
  						buttonToEnable.removeAttr("disabled");
  					} else {
  						buttonToEnable.addClass('disabled');
  						buttonToEnable.attr("disabled", "disabled");
  					}
  				}

  			}

  			checkDateInput=function() {
  			    var input = document.createElement('input');
  			    input.setAttribute('type','date');

  			    var notADateValue = 'not-a-date';
  			    input.setAttribute('value', notADateValue);

  			    return !(input.value === notADateValue);
  			}

  			jQuery(document).on("blur","input[type='text'],input[type='tel'],input[type='email']", function() {
  				jsonResponse.showHideAutoCompleteFlag=undefined;
  	        });
  			/* END CHECK-IN */

  		}

  }
});
