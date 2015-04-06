{Template{
  $classpath: "modules.view.merci.common.templates.MNavButtons",
  $hasScript: true
}}

	{macro main(classList, buttons)}

		{if this._isDynamicHomePage()}
			<div {id 'cards'/} class="dynamic-cards">
				// print button in UI
			{call processButtons({'buttons': buttons})/}
			</div>
		{else/}
			<nav class="${classList} menuLinks{if this.data.isFromMenu !== true} menu-index{/if}">
				<ul{if this.data.isFromMenu == true} class="sb-menu"{/if}>
					// print button in UI
					{call processButtons({'buttons': buttons})/}
				</ul>
			</nav>

			<footer class="bottom webcall footer">
				<div>
					{foreach button inArray buttons}
						{var buttonArr = button.split('|')/}
						{set button = buttonArr[0]/}

						{if button === 'TYPEB'}
							{call typeBLink() /}
						{elseif (button === 'CHANGELANG' && !this.data.isFromMenu)/}
							{call changeLangLink() /}
						{elseif button === 'DESKTOP'/}
							{call desktopLink() /}
						{elseif button === 'BOOKBYPHONE'/}
							{call bookByPhone(buttonArr[2]) /}
						{elseif button === 'FOOTER_CUSTOM'/}
							{call footerCustomPage(buttonArr[2]) /}
						{/if}
					{/foreach}
				</div>
			</footer>
		{/if}
	{/macro}

	{macro processButtons(args)}
		{foreach button inArray args.buttons}
			{var buttonArr = button.split('|')/}
			{set button = buttonArr[0]/}

			{if button == 'HOME'}
				{call homeButton({'label': buttonArr[1]}) /}
			{elseif button == 'MY_PROFILE'/}
				{call myProfile() /}
			{elseif button == 'PARENT_BUTTON'/}
				<li class="sb-sub-menu-holder" {id 'PARENT_HOLDER'  + buttonArr[1]/}>
					<a href="javascript:void(0);" class="navigation" {on click {fn: 'onSubmenuClick', scope: this, args: { key: 'PARENT_BUTTON' + buttonArr[1], holderKey: 'PARENT_HOLDER'  + buttonArr[1]}}/}>${buttonArr[1]}</a>
					<span class="rotArrow" {on click {fn: 'onSubmenuClick', scope: this, args: { key: 'PARENT_BUTTON' + buttonArr[1], holderKey: 'PARENT_HOLDER'  + buttonArr[1]}}/}></span>
					<ul {id 'PARENT_BUTTON' + buttonArr[1]/} class="hidden sb-sub-menu">
						{call processButtons({'buttons': this._getSubMenuButtons({'buttons': args.buttons[parseInt(button_index)]})})/}
					</ul>
				</li>
			{elseif button === 'BOOKFLIGHT'/}
				{call bookFlightButton() /}
			{elseif button === 'RETRIEVE'/}
				{call retrieveButton() /}
			{elseif button === 'CHECKIN_HOME'/}
				{call checkinButton('home') /}
			{elseif button === 'CHECKIN_SEG'/}
				{call checkinButton('seg') /}
			{elseif button === 'FAREDEALS'/}
				{call fareDealsButton() /}
			{elseif button === 'CONTACTUS'/}
				{call contacUsButton() /}
			{elseif button === 'FLIFO'/}
				{call flightInfoButton() /}
			{elseif button === 'TIMETABLE'/}
				{call timeTableButton() /}
			{elseif button === 'EMAIL'/}
				{call emailButton() /}
			{elseif button === 'REBOOK'/}
				{call rebookButton() /}
			{elseif button === 'CUSTOM'/}
				{if this.utils.booleanValue(this.data.config.enblHomePageAlign)}
					{call customButtons({
						'label': buttonArr[1], 
						'url': buttonArr[2],
						'action': buttonArr[3],
						'actionData': buttonArr[4],
						'cssClass': buttonArr[5]
					}) /}
				{else/}
					{call customButtonsTable() /}
				{/if}
			{elseif button === 'MEAL'/}
				{call mealButton() /}
			{elseif button === 'TRIPPHOTOS'/}
				{call tripPhotosButton() /}
			{elseif button === 'FAVORITE'/}
				{call myFavoriteButton() /}
			{elseif button === 'SETTING'/}
				{call mySettingButton() /}
			{elseif button === 'REPEATTRIP'/}
				{call repeatTripButton() /}
			{elseif button === 'HOTEL'/}
				{call displayBookHotelButton()/}
			{elseif button === 'CAR'/}
				{call displayBookCarButton()/}
			{elseif button === 'BOARDINGPASS'/}
				{call displayBoardingPassButton()/}
			{elseif button.substring(0,6) === 'SOCIAL'/}
				{call customSocialButton(button,buttonArr[1],buttonArr[2])/}
			{/if}
		{/foreach}
	{/macro}

	{macro button(args)}
		{if !this._isDynamicHomePage()}
			<li{if args.containerCss != null} class="${args.containerCss}"{/if}{if args.clickFn != null} {on click args.clickFn/}{/if}>
				{if args.containerText != null}${args.containerText}{/if}
				{if !this.data.isFromMenu && args.spanCss != null}
					<span class="${args.spanCss}"></span>
				{/if}
				<a href="javascript:void(0)" {if args.buttonId != null} id="${args.buttonId}"{/if} {if args.buttonUrl != null}{on click {fn: 'onCustomButtonClick', scope: this, args: {'url': args.buttonUrl, 'target': args.buttonTarget, 'action': args.action, 'actionData': args.actionData}}/}{/if}{if args.buttonCss != null} class="${args.buttonCss}"{/if}>
					{if args.buttonText == null}&nbsp;{else/}${args.buttonText}{/if}{if args.buttonSpanText != null}<span>${args.buttonSpanText}</span>{/if}
				</a>
			</li>
		{else/}
			{call dynamicButton(args)/}
		{/if}
	{/macro}

	{macro dynamicButton(args)}
		<div{if args.containerCss != null} class="${args.containerCss}"{/if}{if args.clickFn != null} {on click args.clickFn/}{/if}>
			<button{if args.buttonId != null} id="${args.buttonId}"{/if} type="button"{if args.buttonUrl != null} {on click {fn: 'onCustomButtonClick', scope: this, args: {'url': args.buttonUrl, 'target': args.buttonTarget}}/}{/if} class="dynamic-card{if args.buttonCss != null} ${args.buttonCss}{/if}">
				{if args.buttonText == null}&nbsp;{else/}${args.buttonText}{/if}
			</button>
		</div>
	{/macro}

	{macro mealButton()}
		{if this.isMealEnabled() && !this.utils.booleanValue(this.data.config.merciServiceCatalog)}

			{var buttonText = this.data.labels.tx_merci_text_mealsel_mealpref/}
			{if this.moduleCtrl.getModuleData().isMealSelected == 'FALSE'
				|| this.utils.isEmptyObject(this.moduleCtrl.getModuleData().isMealSelected)}
				{set buttonText = this.data.labels.tx_merci_text_mybook_selmeal/}
			{/if}

			{var cssClass = 'navigation meal'/}
			{if (this.data.common.sadadPaymentInd != 'undefined'
				&& this.data.common.sadadPaymentInd==true)
				|| this.data.common.paymentType=="ASN"}
				{set cssClass += ' hidden'/}
			{/if}

			/*Added as part of CR 5533028- SADAD Implementation for MeRCI- START*/
			{call button({
				'clickFn': {
					fn: 'onMealClick',
					scope: this
				},
				'buttonCss': cssClass,
				'buttonText': buttonText
			})/}
		{/if}
	{/macro}

	{macro homeButton(args)}
		{call button({
			'clickFn': {
				fn: 'onHomeClick',
				scope: this
			},
			'containerCss': 'home-button',
			'buttonCss': 'navigation',
			'buttonText': args.label,
			'spanCss': 'hidden icon-home'
		})/}
	{/macro}

	{macro bookFlightButton()}
		{if this.isBookFlightEnabled()}
			{call button({
				'clickFn': {
					fn: 'onBookFlightClick',
					scope: this
				},
				'containerCss': 'BookFlightButton',
				'buttonCss': 'navigation book-flight',
				'buttonText': this.data.labels.tx_merci_text_booking_index_bookaflight,
				'spanCss': 'hidden icon-plane'
			})/}
		{/if}
	{/macro}

	{macro retrieveButton()}
		{if this.isRetrieveEnabled()}
			{call button({
				'clickFn': {
					fn: 'onRetrieveClick',
					scope: this
				},
				'containerCss': 'retrieveButton',
				'buttonCss': 'navigation my-trip',
				'buttonText': this.data.labels.tx_merci_text_mytrip,
				'spanCss': 'hidden icon-file-alt'
			})/}
		{/if}
	{/macro}

	{macro checkinButton(page)}
		{if this.isCheckinEnabled(page)}
			{call button({
				'clickFn': {
					fn: 'onCheckinClick',
					scope: this,
					args: {
						page: page
					}
				},
				'containerCss': 'checkinButton',
				'buttonCss': 'navigation checkin',
				'buttonText': this.data.labels.tx_merci_text_air_check_in,
				'spanCss': 'hidden icon-sitemap'
			})/}
		{/if}
	{/macro}

	{macro fareDealsButton()}
		{if this.isFareDealsEnabled()}
			{call button({
				'clickFn': {
					fn: 'onFareDealsClick',
					scope: this
				},
				'buttonCss': 'navigation deals',
				'buttonText': this.data.labels.tx_merci_text_do_fare_deals,
				'spanCss': 'hidden icon-tag'
			})/}
		{/if}
	{/macro}

	{macro contacUsButton()}
		{if this.isContactUsEnabled()}
			{call button({
				'clickFn': {
					fn: 'onContactUsClick',
					scope: this
				},
				'buttonCss': 'navigation contact',
				'buttonText': this.data.labels.tx_merci_text_callus_contactus,
				'spanCss': 'hidden icon-phone'
			})/}
		{/if}
	{/macro}

	{macro flightInfoButton()}
		{if this.isFlightInfoEnabled()}
			{call button({
				'clickFn': {
					fn: 'onFlightInfoClick',
					scope: this
				},
				'buttonCss': 'navigation flight-status',
				'buttonText': this.data.labels.tx_merci_text_home_btnflightinfo,
				'spanCss': 'hidden icon-info-sign'
			})/}
		{/if}
	{/macro}

	{macro timeTableButton()}
		{if this.isTimeTableEnabled()}
			{call button({
				'clickFn': {
					fn: 'onTimeTableClick',
					scope: this
				},
				'buttonCss': 'navigation timetable baselineText',
				'buttonText': this.data.labels.tx_merci_text_tt_timetable_title,
				'spanCss': 'hidden icon-calendar'
			})/}
		{/if}
	{/macro}

	{macro customButtons(args)}
		{if this.isCustomButtonsEnabled()}
			
			{var cssClass = 'navigation '/}
			{if args.cssClass != null}
				{set cssClass +=args.cssClass/}
			{else/}
				{set cssClass += 'customIco'/}
			
			{/if}
		
			{call button({
				'buttonCss': cssClass,
				'buttonText': args.label,
				'spanCss': 'hidden icon-sitemap',
				'buttonUrl': args.url,
				'action': args.action,
				'actionData': args.actionData
			})/}
		{/if}
	{/macro}

	{macro customButtonsTable(label,url)}
		{if this.isCustomButtonsEnabled()}
			{foreach customButton inArray this.data.globalList.customButtons}
				{call button({
					'buttonCss': 'navigation customIco',
					'buttonText': customButton[1],
					'spanCss': 'hidden icon-sitemap',
					'buttonUrl': customButton[2],
					'action': customButton[12],
					'actionData': customButton[14]
				})/}
			{/foreach}
		{/if}
	{/macro}

	{macro rebookButton()}
		{if this.utils.booleanValue(this.data.config.rebookingEnabled)}

			{var callback = null/}
			{if this.isRebookEnabled()}
				{set callback = {
					fn: 'onRebookClick',
					scope: this
				}/}
			{/if}

			{var cssClass = 'navigation'/}
			{if !this.isRebookEnabled()}
				{set cssClass += ' disabled'/}
			{/if}

			{call button({
				'clickFn': callback,
				'buttonCss': cssClass,
				'buttonText': this.data.labels.tx_merci_change_trip
			})/}
		{/if}

		{if this.moduleCtrl.getModuleData().MBookingDetails.refundDetails
			&& this.moduleCtrl.getModuleData().MBookingDetails.refundDetails.STATUS=="REFUNDABLE"
			&& this.utils.booleanValue(this.data.config.allowCancelRefund)}

			{call button({
				'clickFn': {
					fn: 'onRefundClick',
					scope: this
				},
				'buttonCss': 'navigation',
				'buttonText': 'Cancel and Refund'
			})/}
		{/if}
	{/macro}

	{macro emailButton()}
		{if this.isEmailTripEnabled()}
			{call button({
				'clickFn': {
					fn: 'onEmailClick',
					scope: this
				},
				'buttonCss': 'navigation',
				'buttonText': this.data.labels.tx_merci_text_mybook_mailfriend
			})/}
		{/if}
	{/macro}

	{macro typeBLink()}
		{if this.isTypeBLinkEnabled()}
			{call button({
				'containerCss': 'website',
				'containerText': this.data.labels.tx_merci_text_booking_index_problemd1,
				'buttonText': this.data.labels.tx_merci_text_booking_index_problemd2
			})/}
		{/if}
	{/macro}

	{macro changeLangLink()}
		{if this.isChangeLangEnabled()}
			{call button({
				'clickFn': {
					fn: 'onChangeLanguageClick',
					scope: this
				},
				'containerCss': 'language',
				'buttonText': this.data.labels.tx_merci_text_home_changelang
			})/}
		{/if}
	{/macro}

	{macro desktopLink()}
		{if this.isDesktopLinkEnabled()}
			{call button({
				'clickFn': {
					fn: 'onDesktopLinkClick',
					scope: this
				},
				'containerCss': 'website',
				'buttonText': this.data.labels.tx_merci_text_go_to_website
			})/}
		{/if}
	{/macro}

	{macro bookByPhone(url)}
		{call button({
			'containerCss': 'bookByPhone',
			'buttonText': this.data.labels.tx_merciapps_book_by_phone,
			'buttonUrl': 'tel:${url}'
		})/}
	{/macro}
	
	{macro footerCustomPage(url)}
		{call button({
				'clickFn': {
					fn: 'footerCustomPage',
					scope: this,
					args: {
						url: url
					}
				},
				'containerCss': 'footer-custom',
				'buttonText': this.data.labels.tx_merciapps_txt_ff_programme
			})/}
	{/macro}

	{macro tripPhotosButton()}
		{if this.isTripPhotosEnabled()}
			{call button({
				'clickFn': {
					fn: 'onTripPhotosClick',
					scope: this
				},
				'buttonCss': 'navigation',
				'buttonText': "Trip Photos " + this.getTripPhotoCount(),
				'buttonId': 'tripPhoto_count'
			})/}
		{/if}
	{/macro}

	{macro myFavoriteButton()}
		{if this.isFavLinkEnabled()}
			{call button({
				'clickFn': {
					fn: 'onMyFavoriteClick',
					scope: this
				},
				'buttonCss': 'navigation my-favorite',
				'buttonText': this.data.labels.tx_merciapps_my_favorite,
				'spanCss': 'hidden icon-star'
			})/}
		{/if}
	{/macro}


	{macro displayBookHotelButton()}
		{if this.isAgodaLinkEnabled()}

			{var callback = {
				fn: 'onBookHotelClick',
				scope: this
			}/}
			{if this.utils.isRequestFromApps()== true}
				{set callback = {
					fn: 'onCustomButtonClick',
					scope: this,
					args: {
						url: this.data.config.bookHotelUrl
					}
				}/}
			{/if}

			{call button({
				'clickFn': callback,
				'containerCss': 'book-hotel',
				'buttonCss': 'navigation bookHotel',
				'buttonTarget': '_blank',
				'buttonText': this.data.labels.tx_merci_text_book_hotel,
				'buttonSpanText': ' '
			})/}
		{/if}
	{/macro}

	{macro displayBookCarButton()}
		{if !this.isCarLinkEnabled()}
			{var callback = {
				fn: 'onCarRentalClick',
				scope: this
			}/}
			{if this.utils.isRequestFromApps()== true}
				{set callback = {
					fn: 'onCustomButtonClick',
					scope: this,
					args: {
						url: this.data.config.sqCarUrl
					}
				}/}
			{/if}
			{call button({
				'clickFn': callback,
				'containerCss': 'book-car',
				'buttonId':'car_Rental',
				'buttonCss': 'navigation bookCar',
				'buttonTarget': '_blank',
				'buttonText': this.data.labels.tx_merci_text_book_car,
				'buttonSpanText': ' '
			})/}
		{/if}
	{/macro}

	{macro displayBoardingPassButton()}
		{if this.isBoardingPassPresent()}
		{call button({
			'clickFn': {
				fn: 'onBoardingPassClick',
				scope: this
			},
			'buttonCss': 'navigation boardingpass',
			'buttonText': 'Boarding Pass'
		})/}
		{/if}
	{/macro}

	{macro mySettingButton()}
		{if this.isSettingLinkEnabled()}
			{call button({
				'clickFn': {
					fn: 'onSettingClick',
					scope: this
				},
				'buttonCss': 'navigation setting',
				'buttonText': this.data.labels.tx_merciapps_settings,
				'spanCss': 'hidden icon-cog'
			})/}
		{/if}
	{/macro}

	  {macro myProfile()}
		{if this.isMyProfileEnabled()}
			{call button({
				'clickFn': {
					fn: 'onMyProfileClick',
					scope: this
				},
				'buttonCss': 'navigation userProfile',
				'buttonText': this.data.labels.tx_merci_dl_myProfile,
				'spanCss': 'hidden icon-user-md'
			})/}
		{/if}
	{/macro}

	{macro repeatTripButton()}
		{if this.utils.booleanValue(this.data.config.siteEnableRepeatTrip)}
			{call button({
				'clickFn': {
					fn: 'onRepeatBookClick',
					scope: this
				},
				'buttonCss': 'navigation userProfile',
				'buttonText': this.data.labels.tx_merci_repeat_trip
			})/}
		{/if}
	{/macro}

	{macro customSocialButton(button,label,url)}

		{var cssClassName = ''/}
		{var button_Type = button.split('_')/}

		{if button_Type[1].toUpperCase() == "FACEBOOK"}
			{set cssClassName = 'faceBookIcon'/}
		{elseif button_Type[1].toUpperCase() == "TWITTER"/}
			{set cssClassName = 'twitterIcon'/}
		{elseif button_Type[1].toUpperCase() == "YOUTUBE"/}
			{set cssClassName = 'youTubeIcon'/}
		{elseif button_Type[1].toUpperCase() == "LINKEDIN"/}
			{set cssClassName = 'linkedInIcon'/}
		{/if}

		{call button({
			'clickFn': {
				fn: 'onCustomButtonClick',
				scope: this,
				args: {
					url: url
				}
			},
			'containerCss': cssClassName
		})/}
	{/macro}
{/Template}