{Template {
  $classpath: "modules.view.merci.common.templates.MerciTabletHome",
  $hasScript: true
}}
	
	{var myScroll = null/}
	{macro main()}
		
		<header class="banner">
			<h1><span>Home</span></h1>
		</header>
		<section>
			
			// embed for navigation
			{@embed:Placeholder {
				name: 'navigation'
			}/}
			
			{var urlBaseParams = modules.view.merci.common.utils.URLManager.getBaseParams()/}
			{var urlHomePath = urlBaseParams[0]  + '://' + urlBaseParams[1] + '/' + 'plnext/default/' + urlBaseParams[5] + '/static/merciAT/debug/modules'/}
			
			<div class="list daof">
				<div class="content customContent">
				  <div id="wrapperDeals" style="overflow: hidden;">
					<div id="scrollerDeals" style="-webkit-transition: -webkit-transform 0ms; transition: -webkit-transform 0ms; -webkit-transform-origin: 0px 0px; -webkit-transform: translate3d(0px, 0px, 0);">
					  <ul role="listbox" id="listbox">
						<li role="option">
						  <div class="tabletWrapperContent"><span class="tabPin"></span> <span class="price posR"><span class="addFavSlide"></span> SGD 298</span>
							<p><span class="city">Singapore</span> <span class="dash">-</span> <span class="city">Ho Chi Minh City</span></p>
							<p class="schedule">
							  <time class="departure date" datetime="2012-03-01">01 Mar 2012</time>
							  <span>to</span>
							  <time class="arrival date" datetime="2012-03-31">31 Mar 2012</time>
							</p>
						  </div>
						  <div class="tabletDeals"><img src="${urlHomePath + '/style/baseline/img/01.png'}" width="622" height="300"></div>
						  <img src="${urlHomePath + '/images/client/Ho-Chi-Minh-City_high.jpg'}" width="180" height="135" alt="alternative text"> </li>
						<li role="option">
						  <div class="tabletWrapperContent"><span class="tabPin"></span><span class="price posR"><span class="addFavSlide"></span> SGD 298</span>
							<p> <span class="city">Singapore</span> <span class="dash">-</span> <span class="city">Manila</span> </p>
							<p class="schedule">
							  <time class="departure date" datetime="2012-03-01">01 Mar 2012</time>
							  <span>to</span>
							  <time class="arrival date" datetime="2012-03-31">31 Mar 2012</time>
							</p>
						  </div>
						  <img src="${urlHomePath + '/images/client/manila_high.jpg'}" width="180" height="135" alt="alternative text">
						  <div class="tabletDeals"><img src="${urlHomePath + '/style/baseline/img/03.png'}" width="622" height="300"></div>
						</li>
						<li role="option">
						  <div class="tabletWrapperContent"><span class="tabPin"></span><span class="price posR"><span class="addFavSlide"></span> SGD 298</span>
							<p> <span class="city">Singapore</span> <span class="dash">-</span> <span class="city">Guangzhou</span> </p>
							<p class="schedule">
							  <time class="departure date" datetime="2012-03-01">01 Mar 2012</time>
							  <span>to</span>
							  <time class="arrival date" datetime="2012-03-31">31 Mar 2012</time>
							</p>
						  </div>
						  <img src="${urlHomePath + '/images/client/guangzhou_high.jpg'}" width="180" height="135" alt="alternative text">
						  <div class="tabletDeals"><img src="${urlHomePath + '/style/baseline/img/04.png'}" width="622" height="300"></div>
						</li>
						<li role="option">
						  <div class="tabletWrapperContent"><span class="tabPin"></span><span class="price posR"><span class="addFavSlide"></span> SGD 298</span>
							<p> <span class="city">Singapore</span> <span class="dash">-</span> <span class="city">Hong Kong</span> </p>
							<p class="schedule">
							  <time class="departure date" datetime="2012-03-01">01 Mar 2012</time>
							  <span>to</span>
							  <time class="arrival date" datetime="2012-03-31">31 Mar 2012</time>
							</p>
						  </div>
						  <img src="${urlHomePath + '/images/client/hong-kong_high.jpg'}" width="180" height="135" alt="alternative text">
						  <div class="tabletDeals"><img src="${urlHomePath + '/style/baseline/img/05.png'}" width="622" height="300"></div>
						</li>
						<li role="option">
						  <div class="tabletWrapperContent"><span class="tabPin"></span> <span class="price posR"><span class="addFavSlide"></span> SGD 298</span>
							<p> <span class="city">Singapore</span> <span class="dash">-</span> <span class="city">Colombo</span> </p>
							<time class="departure date" datetime="2012-03-01">01 Mar 2012</time>
							<span>to</span>
							<time class="arrival date" datetime="2012-03-31">31 Mar 2012</time>
						  </div>
						  <img src="${urlHomePath + '/images/client/colombo_high.jpg'}" width="180" height="135" alt="alternative text">
						  <div class="tabletDeals"><img src="${urlHomePath + '/style/baseline/img/06.png'}" width="622" height="300"></div>
						</li>
					  </ul>
					</div>
				  </div>
				</div>
			</div>
			
			<div class="tabletMap">
				<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=bangalore&amp;aq=&amp;sll=12.938314,77.658749&amp;sspn=0.148063,0.264187&amp;ie=UTF8&amp;hq=&amp;hnear=Bangalore,+Bangalore+Urban,+Karnataka,+India&amp;t=m&amp;z=11&amp;iwloc=A&amp;output=embed"></iframe>
				<br>
				<small>
					<a href="https://maps.google.com/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=bangalore&amp;aq=&amp;sll=12.938314,77.658749&amp;sspn=0.148063,0.264187&amp;ie=UTF8&amp;hq=&amp;hnear=Bangalore,+Bangalore+Urban,+Karnataka,+India&amp;t=m&amp;z=11&amp;iwloc=A" style="color:#0000FF;text-align:left">
						View Larger Map
					</a>
				</small>
			</div>
			
			<section class="tabletTriplist pnr-retrieve list">
				<article class="panel list triplist">
					<header>
						<h1>MY TRIP</h1>
					</header>
					<section>
						<ul role="listbox">
							<li role="option">
								<h2>Booking Reference : DEF456</h2>
								<p class="route"> <span class="city">Singapore <abbr>(SIN)</abbr></span> <span class="dash">-</span> <span class="city">Nice <abbr>(NCE)</abbr></span> </p>
								<p class="period">
									<time class="date" datetime="2012-08-30">30 Aug 2012</time>
									<span>to</span>
									<time class="date" datetime="2012-10-31">31 Oct 2012</time>
								</p>
							</li>
							<li role="option">
								<h2>Booking Reference : DEF678</h2>
								<p class="route"> <span class="city">Singapore <abbr>(SIN)</abbr></span> <span class="dash">-</span> <span class="city">Munich <abbr>(MUC)</abbr></span> </p>
								<p class="period">
									<time class="date" datetime="2012-12-12">12 Dec 2012</time>
									<span>to</span>
									<time class="date" datetime="2013-01-02">02 Jan 2013</time>
								</p>
							</li>
						</ul>
					</section>
					<footer>
						<p>Is your trip not listed? Retrieve trip.</p>
						<a href="#" class="secondary">Retrieve</a> 
					</footer>
				</article>
			</section>
			
			<section class="booking sear tablet">
				<header>
					<h1>
						Search
						<span class="tabletPanelClose" {on click {fn: 'closePanel'}/}>close</span>
					</h1>
				</header>
				// embed for search
				{@embed:Placeholder {
					name: 'searchpage'
				}/}
			</section>
			
			<div class="overlayTablet" style="display: none;" {on click {fn:'overlayTabletClick'}/}></div>
		</section>
	{/macro}
	
{/Template}