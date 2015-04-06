{Template{
	$classpath: 'modules.view.merci.segments.booking.templates.alpi.fqtv.MAlpiFQTV',
	$hasScript: true,
	$macrolibs: {
		autocomplete: 'modules.view.merci.common.widgets.autocomplete.AutoCompleteLibrary'
	}
}}
	{macro main()}
		
		{var labels = this.data.labels/}
		{var gblLists = this.data.gblLists/}
		{var rqstParams = this.data.rqstParams/}
		{var siteParameters = this.data.siteParameters/}
		<div class="row">
			{if (this.data.directLogin == "YES" && this.data.flowFrom === "profilePage" )}
				{var ffProgram = "" /}
				{var ffpNo = "" /}
				{set ffProgram = "ffprogram"+rqstParams.USER_ID_1 /}
				{set ffpNo = "ffnumber"+rqstParams.USER_ID_1 /}
				<div class="field-6">
					<div class="padding-right">
						<p class="pi_fqprog">
							<label for="ffProgram">Frequent Flyer Program</label>
							<input id="ffProgram" type="text" readonly = "readonly"/>
						</p>
					</div>
				</div>
				<div class="field-6">
					<p class="pi_fqnum">
						<label for="ffpNo">Frequent Flyer Number</label>
						<input id="ffpNo" type="text" {if rqstParams.PREF_AIR_FREQ_NUMBER_1_1.indexOf("undefined") == -1} value="${rqstParams.PREF_AIR_FREQ_NUMBER_1_1}" {/if} readonly = "readonly" />
					</p>
				</div>
			{elseif this.data.earlyLogin == "YES" /}
				{var ffProgram = "" /}
				{var ffpNo = "" /}
				{set ffProgram = "ffprogram"+rqstParams.USER_ID_1 /}
				{set ffpNo = "ffnumber"+rqstParams.USER_ID_1 /}
				<div class="field-6">
					<div class="padding-right">
						<p class="pi_fqprog">
							<label for="ffProgram">Frequent Flyer Program</label>
							<input id="ffProgram" type="text" value="" placeholder="Frequent flyer program" />
						</p>
					</div>
				</div>
				<div class="field-6">
					<p class="pi_fqnum">
						<label for="ffpNo">Frequent Flyer Number</label>
						<input id="ffpNo" type="text" {if rqstParams.PREF_AIR_FREQ_NUMBER_1_1 != null } value="${rqstParams.PREF_AIR_FREQ_NUMBER_1_1}" {/if} placeholder="Frequent flyer number" />
					</p>
				</div>
			{else /}	
				
				{var error = this.data.error/}
				{var merciFunc=modules.view.merci.common.utils.MCommonScript/}
				{set traveller = this.data.traveller/}		
				{var loginProfilesBean=rqstParams.loginProfilesBean/}
				
				{if (!merciFunc.isEmptyObject(rqstParams.listTravellerBean.travellerMap))}
					{foreach travelMap in rqstParams.listTravellerBean.travellerMap}
						{set pax = travelMap/}
						{set paxIndex = travelMap_index/}
						{set ffInfo = travelMap.frequentFlyers/}
					{/foreach}
				{/if}
				
				<input type="hidden" name="intTravellerLen" value="${paxIndex}"/>
				{set varUserDataList = rqstParams.userDataList /}
				{set varValidateAirlineCode = rqstParams.airlineCode /}
				{set varValidateAirlineNum = rqstParams.airlineNum /}
				{set numAirlineCode = 0 /}
				{set numAirlineNum = 0 /}

				{if (!merciFunc.isEmptyObject(varValidateAirlineCode))}
					{foreach varLoopValidateAirlineCode in varValidateAirlineCode}
						{if (varLoopValidateAirlineCode == 'invalidAirlineCode')}
							{set numAirlineCode = parseInt(varLoopValidateAirlineCode_index)/}
						{/if}
					{/foreach}
				{/if}
				
				{if (!merciFunc.isEmptyObject(varValidateAirlineNum))}
					{foreach varLoopValidateAirlineNum in varValidateAirlineNum}
						{if (varLoopValidateAirlineNum == 'invalidAirlineNum')}
							{set numAirlineNum = parseInt(varLoopValidateAirlineNum_index)/}
						{/if}
					{/foreach}
				{/if}
				
				{if (numAirlineCode > 0 || numAirlineNum > 0)}
					<div class="messageError">
						<p class="messageTitle">${labels.tx_merci_text_error_message}</p>
						<ul class="messageDetails">
							{if (numAirlineCode > 0)}
								<li>${error.validFFCode.localizedMessage}></li>
							{/if}
							{if (numAirlineNum > 0)}
								<li>${error.validFFN.localizedMessage}</li>
							{/if}
						</ul>
					</div>
				{/if}

				{foreach current in rqstParams.listTravellerBean.travellerMap}
					{if (traveller.paxNumber == current.paxNumber)}
						{set ffAirlineCode = ""/}
						{set ffAccountNumber = ""/}
						{set varTravellerTitleCode = current.identityInformation.titleCode/}
						{set varIsAirlineListPage = rqstParams.requestBean.fromAirlineListPage/}

						<!-- SPLIT AIRLINE CODE AND AIRLINE NUMBER START -->
						{if (!merciFunc.isEmptyObject(varUserDataList))}
							{set tempStringData = varUserDataList/}
						{else/}
							{set tempStringData = rqstParams.requestBean.varStringArrayData/}
						{/if}
						
						{set strSplitAirlineCode = ""/}
						{set strSplitAirlineNum = ""/}
						{if (tempStringData != undefined)}
						{set varSplitString = tempStringData.split(",")/}
						{foreach varSplitElement in varSplitString}
							{if (varSplitElement_index == current_index)}
								{set strLength = varSplitElement.length/}
								{set varIndexOf = varSplitElement.indexOf('-')/}
								{if (varIndexOf >= 0)}
									{set strSplitAirlineCode = varSplitElement.substring(0,varIndexOf)/}
									{set strSplitAirlineCodelen = strSplitAirlineCode.length/}
									{if (strSplitAirlineCodelen <=0)}
										{set strSplitAirlineCode = ""/}
									{/if}
									{set strSplitAirlineNum = varSplitElement.substring(varIndexOf+1,strLength)/}
									{set strSplitAirlineNumlen = strSplitAirlineNum.length/}
									{if (strSplitAirlineNumlen <=0)}
										{set strSplitAirlineNum = ""/}
									{/if}
								{/if}
							{/if}
						{/foreach}
					{/if}
					<!-- SPLIT AIRLINE CODE AND AIRLINE NUMBER END -->

					{var ffShowList = siteParameters.siteFFShowList/}
					{set ffShowListArr = ffShowList.split(",")/}
					{var ffTypeList = siteParameters.siteFFTypeList/}
					{set ffTypeListArr = ffTypeList.split(",")/}
					{var freqFlyerAirlineList = gblLists.freqFlyerRestList/}
					{for var i=0; i< ffShowListArr.length ; i++}
						{set beCardIndex = i+1/}
						{if (current.paxNumber == 1 && beCardIndex == 1)}
							{set ffAirlineCode = rqstParams.airlineCode/}
							{set ffAccountNumber = rqstParams.ffId/}
						{/if}
						<input type="hidden" name="intbeCardIndex" value="${beCardIndex}"/>
						{if (ffShowListArr[i] == 'show')}
							{set selectedFFAirline = siteParameters.siteDftFreqFlyer/}
							{if (!merciFunc.isEmptyObject(rqstParams.requestBean.freqFlyerAirline))}
								{set selectedFFAirline = rqstParams.requestBean.freqFlyerAirline /}
							{/if}

							{if (ffTypeListArr[i] == 'useFFList')}
								{if (freqFlyerAirlineList.length == 0)}
									<div class="messageError">
										<p class="messageTitle">
											${labels.tx_merci_text_error_message}
										</p>
										<ul class="messageDetails">
											<li>${error.error2130010.localizedMessage}</li>
										</ul>
									</div>
								{/if}
								{if (freqFlyerAirlineList.length == 1)}
									{var firstFlyerAirlineCode = ""/}
									{var firstFlyerAirlineNum = ""/}
									<input type="hidden" maxLength="2" value="${freqFlyerAirlineList[0][0]}" name="PREF_AIR_FREQ_AIRLINE_${current.paxNumber}_${beCardIndex}"/>
									<p class="pi_fqalone">
										{if (varValidateAirlineNum == undefined || (varValidateAirlineNum.length == 1 && varValidateAirlineNum[0] == ''))}
											<label for="inputFFProg">${labels.tx_merci_text_booking_frequentflyercardnumber}</label>
										{/if}
										{foreach innerPax in rqstParams.listTravellerBean.travellerMap}
											{if (!merciFunc.isEmptyObject(innerPax.frequentFlyers))}
												{set frequentFlyerInfo = innerPax.frequentFlyers/}
												{if (current_index == innerPax_index)}
													{set firstFlyerAirlineCode = frequentFlyerInfo[1].airline/}
													{set firstFlyerAirlineNum = frequentFlyerInfo[1].number/}
												{/if}
											{/if}
										{/foreach}

										{foreach varLoopValidateAirlineNum in varValidateAirlineNum}
											{if (current_index == varLoopValidateAirlineNum_index)}
												<label for="inputFFProg">${labels.tx_merci_text_booking_frequentflyercardnumber}</label>
											{/if}
										{/foreach}

										{set validFFNNum = "firstFFNNum"/}
										{foreach varLoopValidateAirlineNum in varValidateAirlineNum}
											{if (current_index == varLoopValidateAirlineNum_index)}
												{if (varLoopValidateAirlineNum == 'invalidAirlineNum')}
													{set validFFNNum = "false"/}
												{else/}
													{set validFFNNum = "true"/}
												{/if}
											{/if}
										{/foreach}
										
										{if (firstFlyerAirlineNum != null && merciFunc.isEmptyObject(varIsAirlineListPage) && validFFNNum == 'firstFFNNum')}
											{set strSplitAirlineNum = firstFlyerAirlineNum/}
										{elseif (firstFlyerAirlineNum == null && merciFunc.isEmptyObject(varIsAirlineListPage) && validFFNNum == 'firstFFNNum')/}
											{set strSplitAirlineNum = ""/}
										{else/}
											{set strSplitAirlineNum = strSplitAirlineNum/}
										{/if}
										
										{set FQTVNoFromScope = ""/}
										{set freqNoField = "PREF_AIR_FREQ_NUMBER_"+current.paxNumber+"_"+beCardIndex/}
										{if (!merciFunc.isEmptyObject(rqstParams.requestBean[freqNoField]))}
											{set FQTVNoFromScope = rqstParams.requestBean[freqNoField]/}
										{/if}
										
										{if (FQTVNoFromScope == "" && !merciFunc.isEmptyObject(loginProfilesBean) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0]) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0].freqFlyerNum1) )}
											{set freqNum = loginProfilesBean.travellersList[0].freqFlyerNum1/}
											{if (loginProfilesBean.travellersList[0].freqFlyerNum1 == 'Dummyvalue')}
												{set freqNum = ""/}
											{/if}
											{if (current.paxNumber == 1 && beCardIndex == 1)}
												{set FQTVNoFromScope = freqNum/}
											{/if}
										{/if}
										
										{if (FQTVNoFromScope == null || FQTVNoFromScope == "")}
											{set FQTVNoFromScope = strSplitAirlineNum/}
										{/if}
										<input type="hidden" name="validateAirline" value="false" />
										<label class="pi_fqal">${freqFlyerAirlineList[0][0]}</label>
										<input class="" type="text" autocorrect="off" name="PREF_AIR_FREQ_NUMBER_${current.paxNumber}_${beCardIndex}" id="PREF_AIR_FREQ_NUMBER_${current.paxNumber}_${beCardIndex}" value="${FQTVNoFromScope}" maxlength="30"/>
									</p>
								{/if}
								{if (freqFlyerAirlineList.length > 1)}
									<div class="field-6">
										<div class="padding-right">
											<p class="pi_fqalmany">
												{set freqNoField = "PREF_AIR_FREQ_NUMBER_"+current.paxNumber+"_"+beCardIndex/}
												{if (merciFunc.isEmptyObject(varValidateAirlineCode))}
													<input type="hidden" name="validateAirline" value="true" />
													<label class="pi_fqalname">${labels.tx_merci_text_fqtv_airline}</label>
												{/if}
												{foreach innerPax in rqstParams.listTravellerBean.travellerMap}
													{if (!merciFunc.isEmptyObject(innerPax.frequentFlyers))}
													{set frequentFlyerInfo = innerPax.frequentFlyers/}
													{if (current_index == innerPax_index)}
														{set firstFlyerAirlineCode = frequentFlyerInfo[1].airline/}
														{set firstFlyerAirlineNum = frequentFlyerInfo[1].number/}
														{/if}
													{/if}
												{/foreach}

												{set validFFNCode = "firstFFNCode"/}
												{set validFFNNum = "firstFFNNum"/}
												{if (!merciFunc.isEmptyObject(varValidateAirlineCode))}
												{foreach varLoopValidateAirlineCode in varValidateAirlineCode}
													{if (current_index == varLoopValidateAirlineCode_index)}
														<label for="inputFFProg">${labels.tx_merci_text_fqtv_airline}</label>
													{/if}
												{/foreach}
												{/if}

												{if (!merciFunc.isEmptyObject(varValidateAirlineNum))}
												{foreach varLoopValidateAirlineNum in varValidateAirlineNum}
													{if (current_index == varLoopValidateAirlineNum_index)}
														{if (varLoopValidateAirlineNum == 'invalidAirlineNum')}
															{set validFFNNum = "false"/}
														{else/}
															{set validFFNNum = "true"/}
														{/if}
													{/if}
												{/foreach}
												{/if}

												{if (firstFlyerAirlineCode != null && validFFNCode == 'firstFFNCode')}
													{set strSplitAirlineCode = firstFlyerAirlineCode/}
												{elseif (firstFlyerAirlineCode == null && validFFNCode == 'firstFFNCode')/}
													{set strSplitAirlineCode = ""/}
												{else/}
													{set strSplitAirlineCode = strSplitAirlineCode/}
												{/if}

												{if (firstFlyerAirlineNum != null && merciFunc.isEmptyObject(varIsAirlineListPage) && validFFNNum == 'firstFFNNum')}
													{set strSplitAirlineNum = firstFlyerAirlineNum/}
												{elseif (firstFlyerAirlineNum == null && merciFunc.isEmptyObject(varIsAirlineListPage) && validFFNNum == 'firstFFNNum')/}
													{set strSplitAirlineNum = firstFlyerAirlineNum/}
												{else/}
													{set strSplitAirlineNum = strSplitAirlineNum/}
												{/if}

												{set airlineFromScope = ""/}
												{set freqAirlineField = "PREF_AIR_FREQ_AIRLINE_"+current.paxNumber+"_"+beCardIndex/}
												{if !merciFunc.isEmptyObject(rqstParams.requestBean[freqAirlineField])}
													{set airlineFromScope = rqstParams.requestBean[freqAirlineField]/}
												{elseif !merciFunc.isEmptyObject(current.frequentFlyers) && !merciFunc.isEmptyObject(current.frequentFlyers[current.paxNumber])/}
													{set airlineFromScope = current.frequentFlyers[current.paxNumber].airline/}
												{/if}
												{if (airlineFromScope == "" && !merciFunc.isEmptyObject(loginProfilesBean) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0]) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0].freqFlyerCode1 ))}
													{set airlineFromScope = loginProfilesBean.travellersList[0].freqFlyerNum1/}
												{/if}
												{if (siteParameters.showNewContactDisplay == 'FALSE')}
													<select id='PREF_AIR_FREQ_AIRLINE_${current.paxNumber}_${beCardIndex}' name='PREF_AIR_FREQ_AIRLINE_${current.paxNumber}_${beCardIndex}'>
														<option value="" {if (strSplitAirlineCode == null || strSplitAirlineCode == "")}selected="selected"{/if}>${labels.tx_pltg_text_FFPleaseSelect}</option>
														{if (rqstParams.htmlBean.dir == 'rtl')}
															{foreach airlineItem in freqFlyerAirlineList}
																<option value='${airlineItem[0]}' {if (airlineFromScope == airlineItem[0])}selected="selected"{/if}>${airlineItem[1]} - ${airlineItem[0]}</option>
															{/foreach}
														{else/}
															{foreach airlineItem in freqFlyerAirlineList}
																<option value='${airlineItem[0]}' {if (airlineFromScope == airlineItem[0])}selected="selected"{/if}>${airlineItem[1]}						&nbsp;(${airlineItem[0]})</option>
															{/foreach}
														{/if}
													</select>
												{else/}
													
													{var cb=null /}
													{var FreqAirNameField = "PREF_AIR_FREQ_AIRLINE_"+current.paxNumber+"_"+beCardIndex /}
													
													{call autocomplete.createAutoComplete({
														name: FreqAirNameField,
														id: FreqAirNameField,
														autocorrect:"off",
														autocapitalize:"none",
														autocomplete:"off",
														type: 'text',
														value: firstFlyerAirlineCode,
														class: "inputField widthFull",
														source: this.getAirlineList()
													})/}
												{/if}
											</p>
										</div>
									</div>
									
									<div class="field-6">
										<p class="pi_fqalpref">
											{set freqNoField = "PREF_AIR_FREQ_NUMBER_"+current.paxNumber+"_"+beCardIndex/}
											{if (merciFunc.isEmptyObject(varValidateAirlineNum) || (varValidateAirlineNum.length == 1 && varValidateAirlineNum[0] == ''))}
												<label class="pi_fqnum">${labels.tx_merci_text_booking_frequentflyercardnumber}</label>
											{/if}
											{if (!merciFunc.isEmptyObject(varValidateAirlineNum))}
											{foreach varLoopValidateAirlineNum in varValidateAirlineNum}
												{if (current_index == varLoopValidateAirlineNum_index)}
													<label for="inputFFProg">${labels.tx_merci_text_booking_frequentflyercardnumber}</label>
												{/if}
											{/foreach}
											{/if}
											{set FQTVNoFromScope = ""/}
											{set freqNoField = "PREF_AIR_FREQ_NUMBER_"+current.paxNumber+"_"+beCardIndex/}
											{if (!merciFunc.isEmptyObject(rqstParams.requestBean[freqNoField]))}
												{set FQTVNoFromScope = rqstParams.requestBean[freqNoField]/}
											{/if}
											{if (FQTVNoFromScope == "" && !merciFunc.isEmptyObject(loginProfilesBean) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0]) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0].freqFlyerCode1 ))}
												{set freqNum = loginProfilesBean.travellersList[0].freqFlyerNum1/}
												{if (loginProfilesBean.travellersList[0].freqFlyerNum1 == 'Dummyvalue')}
													{set freqNum = ""/}
												{/if}
												{if (current.paxNumber == 1 && beCardIndex == 1)}
													{set FQTVNoFromScope = freqNum/}
												{/if}
											{/if}
											{if (FQTVNoFromScope == null || FQTVNoFromScope == "")}
												{set FQTVNoFromScope = strSplitAirlineNum/}
											{/if}
											<input class="" type="text" autocorrect="off" name="PREF_AIR_FREQ_NUMBER_${current.paxNumber}_${beCardIndex}" id="PREF_AIR_FREQ_NUMBER_${current.paxNumber}_${beCardIndex}" value="${FQTVNoFromScope}" maxlength="30"/>
										</p>
									</div>
								{/if}
							{elseif (ffTypeListArr[i] == 'any')/}
								<div class="field-6">
									<div class="padding-right">
										<p class="pi_fqany">
											{set firstFlyerAirlineCode = ""/}
											{set firstFlyerAirlineNum = ""/}
											{foreach innerPax in rqstParams.listTravellerBean.travellerMap}
												{if !merciFunc.isEmptyObject(innerPax.frequentFlyers)}
												{set frequentFlyerInfo = innerPax.frequentFlyers/}
												{if (current_index == innerPax_index && merciFunc.isEmptyObject(rqstParams.BEError) && rqstParams.checkError == null && frequentFlyerInfo['1'].retrievedFrom != 'FQTR')}
													{set firstFlyerAirlineCode = frequentFlyerInfo[1].airline/}
													{set firstFlyerAirlineNum = frequentFlyerInfo[1].number/}
													{/if}
												{/if}
											{/foreach}
											{set validFFNCode = "firstFFNCode"/}
											{set validFFNNum = "firstFFNNum"/}
											{if (merciFunc.isEmptyObject(varValidateAirlineCode))}
												<label class="pi_fqalcode">${labels.tx_merci_text_fqtv_airlinecode}</label>
											{else/}
												{foreach varLoopValidateAirlineCode in varValidateAirlineCode}
													{if (current_index == varLoopValidateAirlineCode_index)}
														<label for="inputFFProg">${labels.tx_merci_text_fqtv_airlinecode}</label>
													{/if}
												{/foreach}
											{/if}
											{set validFFNNum = "firstFFNNum"/}
											{if (varValidateAirlineNum != undefined && varValidateAirlineNum != "")}
												{foreach varLoopValidateAirlineNum in varValidateAirlineNum}
													{if (current_index == varLoopValidateAirlineNum_index)}
														{if (varLoopValidateAirlineNum == 'invalidAirlineNum')}
															{set validFFNNum = "false"/}
														{else/}
															{set validFFNNum = "true"/}
														{/if}
													{/if}
												{/foreach}
											{/if}
											{if (firstFlyerAirlineCode != "" && validFFNCode == 'firstFFNCode')}
												{set strSplitAirlineCode = firstFlyerAirlineCode/}
											{elseif (firstFlyerAirlineCode == "" && validFFNCode == 'firstFFNCode')/}
												{set strSplitAirlineCode = ""/}
											{else/}
												{set strSplitAirlineCode = strSplitAirlineCode/}
											{/if}

											{if (firstFlyerAirlineNum != "" && merciFunc.isEmptyObject(varIsAirlineListPage) && validFFNNum == 'firstFFNNum')}
												{set strSplitAirlineNum = firstFlyerAirlineNum/}
											{elseif (firstFlyerAirlineNum == "" && merciFunc.isEmptyObject(varIsAirlineListPage) && validFFNNum == 'firstFFNNum')/}
												{set strSplitAirlineNum = firstFlyerAirlineNum/}
											{else/}
												{set strSplitAirlineNum = strSplitAirlineNum/}
											{/if}
											{var tempUserSelListButton = rqstParams.requestBean.varUserSelListButton/}
											{if (tempUserSelListButton != undefined)}
												{set tempUserSelListButton = tempUserSelListButton.substring(11,14)/}
											{/if}
											{set tempUserSelListButton1 = current.paxNumber+"_"+beCardIndex/}
											{var airlineFromScope = ""/}
											{set freqAirlineField = "PREF_AIR_FREQ_AIRLINE_"+current.paxNumber+"_"+beCardIndex/}
											{if (!merciFunc.isEmptyObject(rqstParams.requestBean[freqAirlineField]))}
												{set airlineFromScope = rqstParams.requestBean[freqAirlineField]/}
											{/if}
											{if (airlineFromScope == "" && !merciFunc.isEmptyObject(loginProfilesBean) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0]) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0].freqFlyerCode1 ))}
												{set airlineFromScope = loginProfilesBean.travellersList[0].freqFlyerCode1/}

											{/if}
											{if (strSplitAirlineCode == "")}
												{set strSplitAirlineCode = airlineFromScope/}
											{/if}
										</p>
									
										<p class="smartDropDwn">
											{if (!merciFunc.isEmptyObject(ffAirlineCode))}
												<span class="strong ">${ffAirlineCode}</span>
												<input type="hidden" name="${freqAirlineField}" id="${freqAirlineField}" value="${ffAirlineCode}"/>
											{elseif (tempUserSelListButton != undefined && tempUserSelListButton == tempUserSelListButton1)/}
											
											{var cb=null /}
													{var keyUp=null /}									
													
													{if (siteParameters.siteRetainSearch == 'TRUE')} 
														{set keyUp = {fn:"clrSelected" ,args : {name : freqAirlineField, id: freqAirlineField},scope:this } /}
													{/if}	
													
													{call autocomplete.createAutoComplete({
														name: freqAirlineField,
														id: freqAirlineField,
														size: "6",
														autocorrect:"off",
														autocapitalize:"none",
														autocomplete:"off",
														maxlength: "2",
														type: 'text',
														value: strSplitAirlineCode,
														class: "inputField",
														source: this.getAirlineList()
													})/}								
							
												<input type="submit" name="selectList_${current.paxNumber}_${beCardIndex}" value="${labels.tx_merci_text_fqtv_selfrmlist}" id="fqtvLink" />
											{else/}
												{if (siteParameters.displayPREDTxt == 'FALSE')}
													<select id='${freqAirlineField}' name='${freqAirlineField}'>
														<option value="" {if (strSplitAirlineCode == null || strSplitAirlineCode == "")}selected="selected"{/if}>${labels.tx_pltg_text_FFPleaseSelect}</option>
														{if (rqstParams.htmlBean.dir == 'rtl')}
															{foreach airlineItem in freqFlyerAirlineList}
																<option value='${airlineItem[0]}' {if (airlineItem[0] == airlineFromScope)}selected="selected"{/if}>${airlineItem[1]} - ${airlineItem[0]}</option>
															{/foreach}
														{else/}
															{foreach airlineItem in freqFlyerAirlineList}
																<option value='${airlineItem[0]}' {if (airlineItem[0] == airlineFromScope)}selected="selected"{/if}>${airlineItem[1]}						&nbsp;(${airlineItem[0]})</option>
															{/foreach}
														{/if}
													</select>
												{else/}
												
													{var cb=null /}
													{var keyUp=null /}
													{var freqValue=null /}
													{if (airlineFromScope == null || airlineFromScope == "")}
														{set freqValue= strSplitAirlineCode/}
													{else/}
														{set freqValue= airlineFromScope/}
														
													{/if}
													
													{if (siteParameters.siteRetainSearch == 'TRUE')} 
														{set keyUp = {fn:"clrSelected" ,args : {name : freqAirlineField, id: freqAirlineField},scope:this } /}
													{/if}	
													
													{call autocomplete.createAutoComplete({
														name: freqAirlineField,
														id: freqAirlineField,
														autocorrect:"off",
														autocapitalize:"none",
														autocomplete:"off",
														size: "6",
														maxlength: "2",
														type: 'text',
														value: freqValue,
														class: "inputField widthFull",
														source: this.getAirlineList()
													})/}

												{/if}
											{/if}
										</p>
									</div>
								</div>
								<div class="field-6">
									<p class="pi_fqbkcnum">
										{if (merciFunc.isEmptyObject(varValidateAirlineNum) || (varValidateAirlineNum.length == 1 && varValidateAirlineNum[0] == ''))}
											<label class="pi_fqbkcnum">${labels.tx_merci_text_booking_frequentflyercardnumber}</label>
										{/if}
										{if (!merciFunc.isEmptyObject(varValidateAirlineNum))}
											{foreach varLoopValidateAirlineNum in varValidateAirlineNum}
												{if (current_index == varLoopValidateAirlineNum_index)}
													<label for="inputFFProg">${labels.tx_merci_text_booking_frequentflyercardnumber}</label>
												{/if}
											{/foreach}
										{/if}
									</p>
									<p class="smartDropDwn">
										{set FQTVNoFromScope = ""/}
										{set freqNoField = "PREF_AIR_FREQ_NUMBER_"+current.paxNumber+"_"+beCardIndex/}
										{if (!merciFunc.isEmptyObject(rqstParams.requestBean[freqNoField]))}
											{set FQTVNoFromScope = rqstParams.requestBean[freqNoField]/}
										{/if}
										{if (FQTVNoFromScope == "" && !merciFunc.isEmptyObject(loginProfilesBean) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0]) && !merciFunc.isEmptyObject(loginProfilesBean.travellersList[0].freqFlyerNum1 ))}
											{if (current.paxNumber != 1 || beCardIndex != 1)}
												{set FQTVNoFromScope = ''/}
											{else/}
												{set FQTVNoFromScope = loginProfilesBean.travellersList[0].freqFlyerNum1/}
											{/if}
										{/if}
										{if (FQTVNoFromScope == null || FQTVNoFromScope == "")}
											{set FQTVNoFromScope = strSplitAirlineNum/}
										{/if}
										{if (!merciFunc.isEmptyObject(ffAccountNumber))}
											<span class="strong ">${ffAccountNumber}</span>
											<input type="hidden" name="${freqNoField}" id="${freqNoField}" value="${ffAccountNumber}"/>
										{else/}
											<input type="text" autocorrect="off" class="inputField widthFull" size="6" maxlength="30" name="${freqNoField}" id="${freqNoField}" {if (FQTVNoFromScope == null || FQTVNoFromScope == "")}value="${strSplitAirlineNum}"{else/}value="${FQTVNoFromScope}"{/if} {on keyup {fn:"clrSelected" ,args : {name : freqNoField, id: freqNoField}} /}/>
											<span class="delete hidden" {on click {fn: 'clearField', args: {id: freqNoField}}/} id="del${freqNoField}"><span class="x">x</span></span>
										{/if}

									</p>
								</div>
							{elseif ffTypeListArr[i] != 'none' /}
								<input type="hidden" maxLength="2" value="${ffTypeListArr[i]}" name="PREF_AIR_FREQ_AIRLINE_${current.paxNumber}_${beCardIndex}"/>
								{var freqField = "PREF_AIR_FREQ_NUMBER_"+current.paxNumber+"_"+beCardIndex/}
								<label>${labels.tx_merci_text_fqtv_myflyffnum}</label>
								<label>${ffTypeListArr[i]}</label>
								{if !merciFunc.isEmptyObject(current.frequentFlyers) && !merciFunc.isEmptyObject(current.frequentFlyers[1].airline) && !merciFunc.isEmptyObject(current.frequentFlyers[1].number)}
									{if strSplitAirlineNum == "" && current.frequentFlyers[1].airline == ffTypeListArr[i]}
										{set strSplitAirlineNum=current.frequentFlyers[1].number /}
									{/if}
								{/if}
									<p class="smartDropDwn">
										{if typeof merciFunc !="undefined" && merciFunc.isRequestFromApps()==true}
											{if strSplitAirlineNum =="" && jsonResponse.ui.FQTVNum !=undefined && jsonResponse.ui.FQTVNum !=null && jsonResponse.ui.FQTVNum !=""}
												{set strSplitAirlineNum=jsonResponse.ui.FQTVNum /}
											{/if}
										{/if}
										<input class="inputField widthFull" type="text" name="PREF_AIR_FREQ_NUMBER_${current.paxNumber}_${beCardIndex}" id="PREF_AIR_FREQ_NUMBER_${current.paxNumber}_${beCardIndex}" value="${strSplitAirlineNum}" maxlength="30" {on keyup {fn:"clrSelected" ,args : {name : freqField, id: freqField}} /}/>
										<span class="delete hidden" {on click {fn: 'clearField', args: {id: freqField}}/} id="del${freqField}"><span class="x">x</span></span>
									</p>
								{/if}
							{/if}
						{/for}
					{/if}
				{/foreach}
			{/if}
		</div>
	{/macro}
{/Template}