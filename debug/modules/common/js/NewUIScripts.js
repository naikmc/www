// JavaScript Document

/*
 * 1.Commented all types of document ready's as it is causing problems(Can't access functions)
 *
 * Reason for problem: unknown
 *
 * 2.Changed all jQuery click() to live()
 *
 * Issue: click() function not working
 *
 * Reason: click() work only html present by the time user defined JS loads(Any altrations after JS load, click() wont work).
 * as all html in tpl and it load only after JS load changed click() to live()
 *
 * */

/*$(document).ready(function() {*/

console.log("New ui scripts got loaded");
var _currentAcceptanceconfirmationObject;

	function preventDefaultBehavior(e) {
		e.preventDefault();
	}

	/* hide all tabpanel
	$("[role=tabpanel][data-aria-hidden='true'], section[data-aria-hidden='true'], footer[data-aria-hidden='true'], aside h1[data-aria-hidden='true']").hide();
	/* *************************************************************************** */

	/* hide all hidden
	$("h2[data-aria-hidden='true'], p[data-aria-hidden='true'], div[data-aria-hidden='true'], ul[data-aria-hidden='true']").hide();
	/* *************************************************************************** */

	/* click on expand button
	$("*[role=button][aria-expanded]").live("click",function() {

		if($(this).attr("id") && $(this).parent().prev().attr("class") == "banner")
		{
			return false;
		}

	  var controls= "#"+$(this).attr('aria-controls').replace(/ /g, ',#');
	  var value = $(this).attr('aria-expanded');
	  if(value=="true") {val="false"} else {val="true"}
	  $(this).attr('aria-expanded', val);
	  $(this).attr('aria-hidden', value);
	  $(controls).toggle();
	});*/

	/*
	 * Added to change expand and collapse according to new CSS
	 * */
	$(".sectionDefaultstyle *[role=button][data-aria-expanded]").live("click",function() {

		if($(this).attr("id"))
		{
			return false;
		}

		  var controls= "#"+$(this).attr('data-aria-controls').replace(/ /g, ',#');
		  var value = $(this).attr('data-aria-expanded');
		  if(value=="true") {val="false"} else {val="true"}
		  $(this).attr('data-aria-expanded', val);
		  $(this).attr('data-aria-hidden', value);

		  if (val=="true") {
			   $(controls).animate({
					height: "show"
				}, {
					duration:"fast",
					easing: "swing"
				}, function() {
				// Animation complete.

			  });
		  } else {
			   $(controls).animate({
				height: "hide"
			  }, {
					duration:"fast",
					easing: "swing"
				}, function() {
				// Animation complete.

			  });
		  }

		});









	/*click on tabs acting as radio button on search */
	$('.sectionDefaultstyle nav.tabs li[role=radio] a.navigation').live("click",function(){
		if (! $(this).hasClass('active')){
			$('.tabs li[role=radio]').children().removeClass('active');
			$(this).addClass('active');
		}
	});

	/* click on list element */
	$(".sectionDefaultstyle *[role=option]").live("click",function() {
		var parent=$(this).parents("[role=listbox]").first();
		parent.find("[role=option]").attr("data-aria-selected", "false");
		$(this).attr("data-aria-selected", "true");
		$(this).find("input[type=radio]").attr("checked", "true");
	});
	/* *************************************************************************** */
	$(".sectionDefaultstyle a.add-passbook").live("click",function() {
	  if($('.secondary.add-passbook').hasClass('disabled')){
     		 return false;
   	    }
		$("#dialog-passbook, .msk").show();
	});
/* --------------- MOBILE APP ----------------- */
/*      Hide/show panels for Mobile App         */
/* These rules need to be active for Mobile App */
/* ---------------------------------------------*/

/* Add tabbar into page */
/* With separate link for Home page

$ (function() {
	var tabbar_img;
	if ($("body").hasClass("wlog")){
		tabbar_img = '\ <footer class="tabbar">\
			<img class="clientElement" src="../css/client/sq/img/tabbar.png"/>\
			<nav class="baselineText">\
            	<ul>\
                	<li><a href="#" class="tab-home sel">Home</a></li>\
                	<li><a href="check-in/BKLI.html" class="tab-my-trips">My trips</a></li>\
                    <li><a href="my-favourites/DAOF_LIST29.html" class="tab-my-favourites">My favourites</a></li>\
					<li><a href="check-in/boarding-pass.html" class="tab-boarding">Boarding</a></li>\
                    <li><a href="#" class="tab-more">More</a></li>\
            	</ul>\
            </nav>\
		</footer>\ ';
	} else {
		tabbar_img = '\
		<footer class="tabbar">\
			<img class="clientElement" src="../../css/client/sq/img/tabbar.png"/>\
			<nav class="baselineText">\
            	<ul>\
                	<li><a href="../HOME_WLOG1.html" class="tab-home">Home</a></li>\
                	<li><a href="../check-in/BKLI.html" class="tab-my-trips">My trips</a></li>\
                    <li><a href="../my-favourites/DAOF_LIST29.html" class="tab-my-favourites">My favourites</a></li>\
					<li><a href="../check-in/boarding-pass.html" class="tab-boarding">Boarding</a></li>\
                    <li><a href="#" class="tab-more">More</a></li>\
            	</ul>\
            </nav>\
			<nav class="clientElement">\
            	<ul>\
                	<li><a href="#" class="tab-boarding">Boarding</a></li>\
                	<li><a href="BKLI.html" class="tab-my-trips">Trips</a></li>\
                    <li><a href="../HOME_WLOG1.html" class="tab-home">Home</a></li>\
                    <li><a href="#" class="tab-my-favourites">Favourites</a></li>\
                    <li><a href="#" class="tab-more">More</a></li>\
            	</ul>\
            </nav>\
		</footer>\ ';
	}
	tabbar_img="";
	$("body").append(tabbar_img);*/


	//// pax carrousel ///
	var find_NumberDisabled_left="left";
	var find_NumberDisabled_right="";
	var find_header_page="";
	/*
	 * find_header_page -- 1 Nationality
	 * find_header_page -- 2 Seatmap
	 * */
	function displayNumbers() {

		var buttonsText = $('.carrousel-header a span');

		if(find_header_page == 1)
		{
			var paxNumber = jQuery(".nationality").length;
		}else if(find_header_page == 2)
		{
			var paxNumber = jQuery(".seatmapPaxDetails").length;
		}

		var buttonLeft = $('.carrousel-header a').eq(0);
		var buttonRight = $('.carrousel-header a').eq(1);

		var buttonTextLeft = $('.carrousel-header a').eq(0).find('span');
		var buttonTextRight = $('.carrousel-header a').eq(1).find('span');

		var numberLeft = parseInt(buttonsText.eq(0).attr('data-paxnr'));
		var numberRight = parseInt(buttonsText.eq(1).attr('data-paxnr'));

		if (numberLeft > 0){

			find_NumberDisabled_left="";
			buttonTextLeft.text(numberLeft);
			if (buttonLeft.hasClass('is-disabled')){
				buttonLeft.removeClass('is-disabled');
			}
		} else {

			buttonTextLeft.text("");
			buttonLeft.addClass('is-disabled');
			find_NumberDisabled_left="left";
		}

		if (numberRight <= paxNumber){

			find_NumberDisabled_right="";
			buttonTextRight.text(numberRight);
			if (buttonRight.hasClass('is-disabled')){
				buttonRight.removeClass('is-disabled');
			}
		} else {

			buttonTextRight.text("");
			buttonRight.addClass('is-disabled');
			find_NumberDisabled_right="right";
		}

		if(paxNumber == 1)
		{
			buttonRight.addClass('is-disabled');
			find_NumberDisabled_right="right";
		}


	}

	function highlightSeat(whichPax) {

		var currentlyDisplayed = $('#lowerDeck td.is-current');
		currentlyDisplayed.removeClass('is-current');
		currentlyDisplayed.addClass('selected');

		var paxSeat = $('#lowerDeck td.selected:contains('+whichPax+')');
		paxSeat.removeClass('selected');
		paxSeat.addClass('is-current');


	}

	slideBanner($('.sectionDefaultstyle .m-sliding-banner'));

	function slideBanner(whichBanner) {

		var objectToMove = whichBanner.find('.m-sliding-content').children('ul');
		var seatnumber = whichBanner.find('span[data-seatInfo="seatnr"]');

		whichBanner.find('span[data-seatInfo="seatnr"]').toggleClass("is-hidden");
        whichBanner.find('.m-sliding-content').children('ul').toggleClass("is-seat");
		whichBanner.find('.m-sliding-content').children('ul').children('li').toggleClass("is-seat");
		whichBanner.find('.m-sliding-content').toggleClass("is-seat");

		if (objectToMove.hasClass('is-seat')) {
			seatnumber.animate({width: '3.8em'}, 500, function() {});
			objectToMove.animate({left: '0%'}, 500, function() {});
		} else {
			seatnumber.animate({width: '0'}, 400, function() {});
			objectToMove.animate({left: '-86%'}, 500, function() {});
		}

	}



	//// END sliding banner ///






	var allSeats = $('.sectionDefaultstyle #lowerDeck td[data-type="seat"]');
	var seatsWithOptions1 = $('.sectionDefaultstyle #lowerDeck td.has-property1');
	var seatsWithOptions2 = $('.sectionDefaultstyle #lowerDeck td.has-property2');
	var seatsWithOptions3 = $('.sectionDefaultstyle #lowerDeck td.has-property3');


	removeSeatOutline();

	function removeSeatOutline() {
		seatsWithOptions1.removeClass('has-property1');
		seatsWithOptions2.removeClass('has-property2');
		seatsWithOptions3.removeClass('has-property3');
	}


	//// END Drawer ///


	/* CHECK-IN */

	var anyCheckbox = $('.sectionDefaultstyle ul.checkin-list input[type="checkbox"]');

	var checkBoxPax = $('.sectionDefaultstyle ul.checkin-list[data-info="pax-list"] input[type="checkbox"]');
	var checkBoxFlight = $('.sectionDefaultstyle ul.checkin-list[data-info="flights-ready-list"] input[type="checkbox"]');
	var checkBoxDAG = $('.sectionDefaultstyle ul.checkin-list[data-info="dangerous-goods"] input[type="checkbox"]');

	var addedPax = [];
	var addedImgs = [];


	anyCheckbox.live("change",function(){
		if ($(this).is(':checked')) {
			$(this).parent('li').addClass('is-checked');
		} else{
			$(this).parent('li').removeClass('is-checked');
		}
	});


	//////// ADD INITIAL PAX FOR MONOPAX /////////////////
	if (checkBoxPax.is(':checked')){
		var checkedPaxName = checkBoxPax.val();
		var checkedPaxNameImage = checkBoxPax.siblings('label').children('img').attr('src');
		addPaxInFlights(checkedPaxName, checkedPaxNameImage);
	}
	//////////END ADD INITIAL PAX////////////////


	checkBoxPax.live("change",function(){

		var checkedPaxName = $(this).val();
		var checkedPaxNameImage = $(this).siblings('label').children('img').attr('src');

		if ($(this).is(':checked')) {
			addPaxInFlights(checkedPaxName, checkedPaxNameImage);
		} else{
			removePaxInFlights(checkedPaxName);
		}

		checkIfenableNavigation();
	});



	function addPaxInFlights(which_pax, which_image) {
		var paxToAdd =  which_pax;
		var paxToAddImageUrl = which_image;
		var htmlToAdd = "<li class='pax'><img src='" + paxToAddImageUrl + "'/>"+paxToAdd+"</li>";

		if (addedPax.indexOf(paxToAdd) == -1) {
			$('ul[data-info="pax-sub-list"]').append(htmlToAdd);
			$('ul[data-info="pax-sub-list"]').siblings('div.message').addClass('hidden');

			addedPax.push(paxToAdd);
			addedImgs.push(paxToAddImageUrl);
		}
	}

	function removePaxInFlights(which_pax){
		var paxToRemove =  which_pax;


		if (addedPax.indexOf(paxToRemove) != -1) {
			var which_index = addedPax.indexOf(paxToRemove);
			addedPax.splice(which_index, 1);
			addedImgs.splice(which_index, 1);
			$('ul[data-info="pax-sub-list"]').empty();

			addedPax.forEach(function(entry){
				var indexOfPaxLeft = addedPax.indexOf(entry);

				var paxToAdd = entry;
				var paxToAddImageUrl = addedImgs[indexOfPaxLeft];
				var htmlToAdd = "<li class='pax'><img src='" + paxToAddImageUrl + "'/>"+paxToAdd+"</li>";

				$('ul[data-info="pax-sub-list"]').append(htmlToAdd);
			});
		}
		checkIfEmpty($('ul[data-info="flights-ready-list"] li.is-checked input[type="checkbox"]'));
	}




	checkBoxFlight.live("change",function(){

		checkIfEmpty($(this));
		checkIfenableNavigation();

	});

//	checkBoxDAG.live("change",function() {
//		checkIfenableNavigationDgrGoods();
//	});


	function checkIfEmpty(where){

		var listToCheck = where.siblings('ul[data-info="pax-sub-list"]').children('li.pax').html();


		if (listToCheck === null){
			if (where.is(':checked')) {
				where.siblings('div.message').removeClass('hidden');
			} else {
				where.siblings('div.message').addClass('hidden');
			}

		}
	}



	function checkIfenableNavigation(buttonRef) {

		var buttonToEnable = buttonRef ? buttonRef : $('footer.buttons button').eq(0);

		if (checkBoxPax.is(':checked')) {

			if (checkBoxFlight.width() === null) {
				buttonToEnable.removeClass('disabled');
				buttonToEnable.removeAttr("disabled") ;
			} else {
				if (checkBoxFlight.is(':checked') ) {
					buttonToEnable.removeClass('disabled');
					buttonToEnable.removeAttr("disabled") ;
				} else {
					buttonToEnable.addClass('disabled');
					buttonToEnable.attr("disabled","disabled") ;
				}
			}
		} else {
			buttonToEnable.addClass('disabled');
			buttonToEnable.attr("disabled","disabled") ;
		}


		if (jQuery(checkBoxPax.selector).width() === null) {
			if (jQuery(checkBoxFlight.selector).is(':checked') ) {
				buttonToEnable.removeClass('disabled');
				buttonToEnable.removeAttr("disabled") ;
			} else {
				buttonToEnable.addClass('disabled');
				buttonToEnable.attr("disabled","disabled") ;
			}
		}

	}

	function checkIfenableNavigationDgrGoods(buttonRef, checkBoxDAG, anyPaxActive ) {

		var buttonToEnable = buttonRef ? buttonRef : $('footer.buttons button').eq(0);

				if (jQuery(checkBoxDAG.selector).is(':checked') && anyPaxActive) {
					buttonToEnable.removeClass('disabled');
					buttonToEnable.removeAttr("disabled") ;
				} else {
					buttonToEnable.addClass('disabled');
					buttonToEnable.attr("disabled","disabled") ;
				}
			}


	/* END CHECK-IN */


	/* RETRIEVE PNR */

	var identifyElement = $('.sectionDefaultstyle .check [data-info="identify"] select');
	showFields(identifyElement.val());



	identifyElement.live("change",function(){
		var idValue = $(this).val();
		showFields(idValue);
	});

	function showFields(which_value) {
		$('.check ul.input-elements li').removeClass('hidden');

		switch (which_value) {
			case "ff" :
				$('.check ul.input-elements li[data-info="eticket-number"]').addClass('hidden');
				$('.check ul.input-elements li[data-info="booking-number"]').addClass('hidden');
				break;
			case "br":
				$('.check ul.input-elements li[data-info="frequent-flyer"]').addClass('hidden');
				$('.check ul.input-elements li[data-info="eticket-number"]').addClass('hidden');
				break;
			case "et" :
				$('.check ul.input-elements li[data-info="frequent-flyer"]').addClass('hidden');
				$('.check ul.input-elements li[data-info="booking-number"]').addClass('hidden');
				break;
			default:
				//alert ('value is not recognized');
				break;
		}

	}


	/* END RETRIEVE PNR */


	/* ////////////// Carrousel /////////// */

	var mousePositionX;
	var itemCounter = 0;
	var is_clickedOn_list=-1;
	var itemWidth;

	positionCarrousel($('.sectionDefaultstyle .carrousel-full'));
	lightSelectedUp();

	$(window).resize(function() {
		positionCarrousel($('.carrousel-full'));
		itemCounter = 0;
		lightSelectedUp();
		changeTitle();
	});

	$('.sectionDefaultstyle .carrousel-full').live("mousemove",function(event) {
		mousePositionX = event.pageX;
	});


	function positionCarrousel(which) {
		var containerWidth = which.width();
		itemWidth = which.children('ul').children('li').outerWidth(true) + 4; /*inline-block generates 4px invisible margin. To be checked in all browsers*/
		var position = (containerWidth/2) - (itemWidth/2);
		which.children('ul').css("left", position);
	}

	$('.sectionDefaultstyle .carrousel-full li').live("click",function() {

		is_clickedOn_list=$(this).index();

	});

	$('.sectionDefaultstyle .carrousel-full h1').live("click",function() {


		is_clickedOn_list=$('.carrousel-full-item.is-selected').parent('li').index();

	});

	function makeCustomLink(whichElement, whichEvent) {
		whichEvent.stopPropagation();
		var loc=whichElement.attr('data-location');
		$(location).attr('href',loc);
	}

	function moveCarrousel_left(which_ul) {
		(function(){
			itemCounter +=1;
			lightSelectedUp("left");
			changeTitle();
			which_ul.next('footer').find('li').eq(itemCounter-1).removeClass('is-selected');
			which_ul.next('footer').find('li').eq(itemCounter).addClass('is-selected');
			which_ul.animate ({
				left:'-='+itemWidth+'px'
			}, 250, function() {

			});
		}());

	}

	function moveCarrousel_right(which_ul) {
		(function(){
			itemCounter -=1;
			lightSelectedUp("right");
			changeTitle();
			which_ul.next('footer').find('li').eq(itemCounter+1).removeClass('is-selected');
			which_ul.next('footer').find('li').eq(itemCounter).addClass('is-selected');
			which_ul.animate ({
				left:'+='+itemWidth+'px'
			}, 250, function() {

			});
		}());

	}

	function lightSelectedUp(val) {
try{
		$('.carrousel-full-item').attr(eventItem,"");

		if(val == undefined)
		{
			itemCounter = 0;
			jQuery("#listboxa").find('li').eq(itemCounter).find("article").attr(eventItem,jQuery("#listboxa").find('li').eq(itemCounter).find("article").attr("data-airp-list-onclick"));
		}

		$('.carrousel-full-item').removeClass('is-selected');
		$('.carrousel-full').children('ul').children('li').eq(itemCounter).find('.carrousel-full-item').addClass('is-selected');

		if(val == "left")
		{
			jQuery("#listboxa").find('li').eq(itemCounter).find("article").attr(eventItem,jQuery("#listboxa").find('li').eq(itemCounter).find("article").attr("data-airp-list-onclick"));
		}else if(val == "right")
		{
			jQuery("#listboxa").find('li').eq(itemCounter).find("article").attr(eventItem,jQuery("#listboxa").find('li').eq(itemCounter).find("article").attr("data-airp-list-onclick"));
		}

}catch(e){
console.log(e);
}

	}


	function changeTitle() {
try{
		var widthOfTitle;
		if ($('.carrousel-full-item.is-selected').parent('li').hasClass('multicity')) {
			widthOfTitle = '95%';
		} else if ($('.carrousel-full-item.is-selected').parent('li').hasClass('one-way')) {
			widthOfTitle = '50%';
		}else
		{
			widthOfTitle = '60%';
		}

		var airportOrigin = $('.carrousel-full-item.is-selected').attr('data-airp-points');

		var moreInfo = "<a href='javascript:void(0)' class='more-info'></a>"

		var titleComplete = airportOrigin + " " + moreInfo;

		$('.carrousel-full').children('h1').attr(eventItem,jQuery("#listboxa .is-selected").attr("data-airp-list-onclick"));

		$('.carrousel-full').children('h1').animate({
    		width: "30%",
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
}catch(e){
console.log(e);
}



	}

	/* ////////////// End Carrousel /////////// */



	/* ////////////// checkin services box /////////// */

	function calculateInitHeight(which) {
		var initHeight = which.height();
		//alert (initHeight);
		return initHeight;
	}

	var servicesBoxInitHeight = calculateInitHeight($('.services-box'));

	//$('.services-box').height(0);


	$('.sectionDefaultstyle button.services').live("click",function() {
		var panelToCollapse = $(this).parent('section').find('.services-box');
		unveilPanel(panelToCollapse, servicesBoxInitHeight);

	});


	function unveilPanel(which, whichInitHeight) {

		var heightOfPanel = which.height();

		if (heightOfPanel > 0){

			which.animate({
    			height: "0px",
				opacity: 0
  			}, 400, function() {
    			// Animation complete.
  			});
		} else {

			which.animate({
    			height: whichInitHeight+10,
				opacity: 1
  			}, 400, function() {
    			// Animation complete.
  			});
		}
	}



	/* ////////////// end checkin services box /////////// */



	///*END CHECK-IN FLOW *//////
	///// Toggle - Switch ////

	var toggle = false;
	$('.sectionDefaultstyle ul#input-radio-switch').live("click",function() {
		if (toggle == false) {
			$(this).children('li').eq(0).addClass('on');
			toggle = true;
		} else if (toggle == true){
			$(this).children('li').eq(0).removeClass('on');
			toggle = false;
		}

	});
	/*///////////// services-pax selectable ///// */
	var counterPaxSelected = 0;
  $(".sectionDefaultstyle ul.services-pax.selectable input[type=checkbox]").live("change",function(){
    var buttonToChange = $(this).parentsUntil('section').find('a.secondary.main');
    if ($(this).is(':checked')) {
      buttonToChange.removeClass('disabled');
      var checkBoxes= $(this).parentsUntil('section').find("ul.services-pax.selectable input[type=checkbox]");
      if(!checkBoxes.is(':checked')){
    	  buttonToChange.addClass('disabled');
      }
    } else {
    	var checkBoxes= $(this).parentsUntil('section').find("ul.services-pax.selectable input[type=checkbox]");
        if(!checkBoxes.is(':checked')){
      	  buttonToChange.addClass('disabled');
        }
    }
  });

  function checkifNothigSelected(whichButton) {
    if (counterPaxSelected == 0) {
      whichButton.addClass('disabled');
    }
  }


  /*///////// END services-pax selectable ///////*



  /* ////////////// passbook options /////////// */

  $('.sectionDefaultstyle ul.getPassbook .email').live("click",function() {
    if($('ul.getPassbook .email.disabled').length == 0){
      jQuery(document).scrollTop("0");
      jQuery("#initiateandEditEmailErrors").disposeTemplate();
      openDialog($('#emailPopup'));
    }
  });

  $('.sectionDefaultstyle ul.getPassbook .sms').live("click" , function() {
    if($('ul.getPassbook .sms.disabled').length == 0){
      jQuery(document).scrollTop("0");
      jQuery("#initiateandEditSMSErrors").disposeTemplate();
      openDialog($('#smsPopup'));
      callAutocompleteInConfirmation();
    }
    //$('.popup.input-panel div.message.hidden').addClass('hidden');
  });

  function openDialog(which) {
	  jQuery(".forMCIDialogbox").removeClass("loading");
	which.css('display', 'block');
    $('.msk.forMCIDialogbox').css('display', 'block');
  }


  $('.sectionDefaultstyle .popup.input-panel .buttons .validation').live("click",function() {
    $(this).parent('footer').parent('article').parent('.input-panel').css('display', 'none');
    $('.msk.forMCIDialogbox').css('display', 'none');
  });


  $(".sectionDefaultstyle a.add-passbook").live("click",function() {
    jQuery(document).scrollTop("0");
    if($('.secondary.add-passbook').hasClass('disabled')){
      return false;
    }
    jQuery(".msk").removeClass("loading");
    $("#dialog-passbook, .msk").show();
  });

  $(".sectionDefaultstyle .dialog button.cancel, .dialog button.validation").live("click",function() {
	  if(this.className==("validation active") && this.parentNode.parentNode.id == ("dialog-passbook")){
		  $(".dialog").hide();
		  $(".msk.forMCIDialogbox").show();
	  }
	  else if(this.className==("cancel") && this.parentNode.parentNode.id == ("dialog-passbook")){
		  $(".dialog, .msk").hide();
	  }
  });
