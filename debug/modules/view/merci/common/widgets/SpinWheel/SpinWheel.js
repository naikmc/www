/**
* SpinWheel widget is a aria widget. Most of the logic of the SpinWheel is implemented in this
* file.
*/
Aria.classDefinition({
    $classpath : "modules.view.merci.common.widgets.SpinWheel.SpinWheel",
    $extends : "aria.widgetLibs.BaseWidget",
    // The CSS for the SpinWheel (defined below) will automatically be loaded
	// in the DOM when instances of this class are
	// created, and will automatically be removed when all instances are
	// disposed
    $css : ["modules.view.merci.common.widgets.SpinWheel.SpinWheelCSS"],
    $statics : {
    	/**
		 * Error message displayed in the console in case the configuration
		 * given to the SpinWheel is invalid.
		 *
		 * @type String
		 */
        INVALID_CONFIGURATION : "%1Invalid configuration for the SpinWheel!"
    },
    $dependencies : ['modules.view.merci.common.widgets.SpinWheel.SpinWheelCfgBeans', 'aria.utils.Event',
         			'aria.DomEvent', 'aria.utils.DomOverlay'],

	/**
	 * Create an instance of the SpinWheel.
	 *
	 * @param {aria.templates.TemplateCtxt}
	 *            context template context
	 * @param {Number}
	 *            lineNumber line number in the template
	 */
	$constructor : function(cfg, context, lineNumber) {

		_thisSpinWheel = this;


		// The BaseWidget constructor automatically stores cfg as this._cfg,
		// context as this._context and lineNumber as this._lineNumber
		this.$BaseWidget.constructor.apply(this, arguments);

		// Check the configuration and add default values:
		var normalizeArg = {
			beanName : "modules.view.merci.common.widgets.SpinWheel.SpinWheelCfgBeans.SpinWheelCfg",
			json : this._cfg
		};
		try {
			/**
			 * If true, the configuration was succesfully checked.
			 *
			 * @type Boolean
			 */
			this._cfgOk = aria.core.JsonValidator.normalize(normalizeArg, true);
		} catch (e) {
			// Note that the %1 parameter in the error message is automatically
			// replaced by debugging information
			// including the template classpath and line number
			this.$logError(this.INVALID_CONFIGURATION, null, e);
		}

		if (!this._cfgOk) {
			return;
		}

		/*
		 * // If bindValue is set, register a callback to be called when the
		 * bound value changes var binding = this._cfg.bindValue; if (binding) { //
		 * This allows to use bindings: this._bindingCallback = { fn :
		 * this._notifyDataChange, scope : this };
		 * aria.utils.Json.addListener(binding.inside, binding.to,
		 * this._bindingCallback, false); }
		 */

		

	},
    $destructor : function () {
    	// remove
		// listeners on the document.body:

		// Remove the delegate registration:
		if (this._delegateId) {
			aria.utils.Delegate.remove(this._delegateId);
			this._delegateId = null;
		}
		// Call the destructor of the BaseWidget class. This is especially
		// needed to release ids created through
		// _createDynamicId, and unload the CSS if it is no longer needed.
		this.$BaseWidget.$destructor.call(this);
    },
    $prototype : {
    	/**
		 * Main widget entry-point, called by the widget library. Write the
		 * markup of the Autocomplete.
		 *
		 * @param {aria.templates.MarkupWriter}
		 *            out
		 */
		writeMarkup : function(out) {
			if (!this._cfgOk) {
				// configuration was incorrect, do not generate any markup in
				// this case
				return;
			}            
			var html = ['<time id="'+this._cfg.id+'" class="SpinWheel"></time>'];
			out.write(html.join(''));
		},

        cellHeight: 44,
        friction: 0.005,
        slotData: [],
        months_1 : { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec'},
        months_2 : { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'},
        initWidget : function () {
            var that = this;
            var d = document.getElementById(this._cfg.controlInputs.d)
            var m = document.getElementById(this._cfg.controlInputs.m)
            var y = document.getElementById(this._cfg.controlInputs.y)
            var months = this.months_1;            
            if(this._cfg.controlInputs.monthArr != null){
                var monthArr = this._cfg.controlInputs.monthArr;
                //this.months_1 = { 0: monthArr[0][1], 1: monthArr[1][1], 2: monthArr[2][1], 3: monthArr[3][1], 4: monthArr[4][1], 5: monthArr[5][1], 6: monthArr[6][1], 7: monthArr[7[1], 8: monthArr[8][1], 9: monthArr[9][1], 10: monthArr[10][1], 11: monthArr[11][1]};
                this.months_1 = {0: monthArr[0][1], 1: monthArr[1][1], 2: monthArr[2][1], 3: monthArr[3][1], 4: monthArr[4][1], 5: monthArr[5][1], 6: monthArr[6][1], 7: monthArr[7][1], 8: monthArr[8][1], 9: monthArr[9][1], 10: monthArr[10][1], 11: monthArr[11][1]};
                this.months_2 = {1:monthArr[0][1],2:monthArr[1][1],3:monthArr[2][1],4:monthArr[3][1],5:monthArr[4][1],6:monthArr[5][1],7:monthArr[6][1],8:monthArr[7][1],9:monthArr[8][1],10:monthArr[9][1],11:monthArr[10][1],12:monthArr[11][1]};

            }
            if(this._cfg.monthInd == "1"){
                months = this.months_2;
            }           

            document.getElementById(this._cfg.id).textContent = d.options[d.selectedIndex].value+' '+months[m.options[m.selectedIndex].value]+' '+y.options[y.selectedIndex].value;

            document.getElementById(this._cfg.id).onclick = function(){that.openSpinWheel(d.options[d.selectedIndex].value,m.options[m.selectedIndex].value,y.options[y.selectedIndex].value);}
            $("#"+this._cfg.id).prev("ul").hide();
          },
          /**
  		 * Method called when a DOM event is raised on the input of
  		 * SpinWheel. This method is registered by the
  		 * aria.utils.Delegate.add method in the constructor of the widget.
  		 *
  		 * @param {aria.DomEvent}
  		 *            evt
  		 */
          _delegate : function(evt) {
              console.log(evt.type);
  			var method = this['_spin_' + evt.type];
  			if (method) {
  				method.call(this, evt);

  				evt.preventDefault();
  			}
  		},
        _spin_click : function(){
            this.openSpinWheel(this._cfg.dd, this._cfg.mmm, this._cfg.yyyy);
        },
        openSpinWheel:function(dd,mm,yyyy){   
                var monthArr = this._cfg.controlInputs.monthArr;         
                var now = new Date();
                var days = { };
                var years = { };
                var months = this.months_1;
                if(this._cfg.monthInd == "1"){
                    months = this.months_2;
                }  

                for( var i = 1; i < 32; i += 1 ) {
                    days[i] = i;
                }

                for( i = now.getFullYear(); i > now.getFullYear()-113; i -= 1 ) {
                    years[i] = i;
                }
            this.slotData=[];
            this.addSlot(days, 'right', dd);            
            this.addSlot(months, '', mm);
            this.addSlot(years, 'right', yyyy);
            this.setCancelAction(function(){
                console.log("spinner cancelled");
            });
            this.setDoneAction(function(){
                var results = this.getSelectedValues();
                var leap = [monthArr[1][1],monthArr[3][1],monthArr[5][1],monthArr[8][1],monthArr[10][1]];
                if(leap.indexOf(results.values[1]) > -1) {
                    if(parseInt(results.keys[0])>30){                        
                        results.keys[0]=30;
                        results.values[0]=30;
                    }

                    if(results.values[1] == 'Feb' && parseInt(results.keys[0])>28){                        
                        if(parseInt(results.keys[2])%4 == 0){
                            results.keys[0]=29;
                            results.values[0]=29;
                        }
                        else{
                            results.keys[0]=28;
                            results.values[0]=28;
                        }
                    }
                }

                var dt = new Date();
                document.getElementById(this._cfg.controlInputs.d).selectedIndex = parseInt(results.keys[0])-1;                
                if(this._cfg.monthInd == "1"){
                    document.getElementById(this._cfg.controlInputs.m).selectedIndex = parseInt(results.keys[1])-1;
                }
                else{
                    document.getElementById(this._cfg.controlInputs.m).selectedIndex = parseInt(results.keys[1]);
                }
                document.getElementById(this._cfg.controlInputs.y).selectedIndex = dt.getFullYear() - parseInt(results.keys[2]);
                document.getElementById(this._cfg.id).textContent = results.values.join(' ');                
            });
            this.open();
        },

        handleEvent: function (e) {
            if (e.type == 'touchstart') {
                this.lockScreen(e);
                if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
                    this.tapDown(e);
                } else if (e.currentTarget.id == 'sw-frame') {
                    this.scrollStart(e);
                }
            } else if (e.type == 'touchmove') {
                this.lockScreen(e);

                if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
                    this.tapCancel(e);
                } else if (e.currentTarget.id == 'sw-frame') {
                    this.scrollMove(e);
                }
            } else if (e.type == 'touchend') {
                if (e.currentTarget.id == 'sw-cancel' || e.currentTarget.id == 'sw-done') {
                    this.tapUp(e);
                } else if (e.currentTarget.id == 'sw-frame') {
                    this.scrollEnd(e);
                }
            } else if (e.type == 'webkitTransitionEnd') {
                if (e.target.id == 'sw-wrapper') {
                    this.destroy();
                } else {
                    this.backWithinBoundaries(e);
                }
            } else if (e.type == 'orientationchange') {
                this.onOrientationChange(e);
            } else if (e.type == 'scroll') {
                this.onScroll(e);
            }
        },


        /**
         *
         * Global events
         *
         */

        onOrientationChange: function (e) {
            window.scrollTo(0, 0);
            this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
            this.calculateSlotsWidth();
        },

        onScroll: function (e) {
            this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
        },

        lockScreen: function (e) {
            e.preventDefault();
            e.stopPropagation();
        },


        /**
         *
         * Initialization
         *
         */

        reset: function () {
            this.slotEl = [];

            this.activeSlot = null;

            this.swWrapper = undefined;
            this.swSlotWrapper = undefined;
            this.swSlots = undefined;
            this.swFrame = undefined;
        },

        calculateSlotsWidth: function () {
            var div = this.swSlots.getElementsByTagName('div');
            for (var i = 0; i < div.length; i += 1) {
                this.slotEl[i].slotWidth = div[i].offsetWidth;
            }
        },

        create: function () {
            var i, l, out, ul, div;

            this.reset();	// Initialize object variables

            // Create the Spinning Wheel main wrapper
            div = document.createElement('div');
            div.id = 'sw-wrapper';
            div.style.top = window.innerHeight + window.pageYOffset + 'px';		// Place the SW down the actual viewing screen
            div.style.webkitTransitionProperty = '-webkit-transform';
            div.innerHTML = '<div id="sw-header"><div id="sw-cancel">Cancel</' + 'div><div id="sw-done">Done</' + 'div></' + 'div><div id="sw-slots-wrapper"><div id="sw-slots"></' + 'div></' + 'div><div id="sw-frame"></' + 'div>';

            document.body.appendChild(div);

            this.swWrapper = div;													// The SW wrapper
            this.swSlotWrapper = document.getElementById('sw-slots-wrapper');		// Slots visible area
            this.swSlots = document.getElementById('sw-slots');						// Pseudo table element (inner wrapper)
            this.swFrame = document.getElementById('sw-frame');						// The scrolling controller

            // Create HTML slot elements
            for (l = 0; l < this.slotData.length; l += 1) {
                // Create the slot
                ul = document.createElement('ul');
                out = '';
                for (i in this.slotData[l].values) {
                    out += '<li>' + this.slotData[l].values[i] + '<' + '/li>';
                }
                ul.innerHTML = out;

                div = document.createElement('div');		// Create slot container
                div.className = this.slotData[l].style;		// Add styles to the container
                div.appendChild(ul);

                // Append the slot to the wrapper
                this.swSlots.appendChild(div);

                ul.slotPosition = l;			// Save the slot position inside the wrapper
                ul.slotYPosition = 0;
                ul.slotWidth = 0;
                ul.slotMaxScroll = this.swSlotWrapper.clientHeight - ul.clientHeight - 86;
                ul.style.webkitTransitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';		// Add default transition

                this.slotEl.push(ul);			// Save the slot for later use

                // Place the slot to its default position (if other than 0)
                if (this.slotData[l].defaultValue) {
                    this.scrollToValue(l, this.slotData[l].defaultValue);
                }
            }

            this.calculateSlotsWidth();

            // Global events
            document.addEventListener('touchstart', this, false);			// Prevent page scrolling
            document.addEventListener('touchmove', this, false);			// Prevent page scrolling
            window.addEventListener('orientationchange', this, true);		// Optimize SW on orientation change
            window.addEventListener('scroll', this, true);				// Reposition SW on page scroll

            // Cancel/Done buttons events
            document.getElementById('sw-cancel').addEventListener('touchstart', this, false);
            document.getElementById('sw-done').addEventListener('touchstart', this, false);

            // Add scrolling to the slots
            this.swFrame.addEventListener('touchstart', this, false);
        },

        open: function () {
            this.create();

            this.swWrapper.style.webkitTransitionTimingFunction = 'ease-out';
            this.swWrapper.style.webkitTransitionDuration = '400ms';
            this.swWrapper.style.webkitTransform = 'translate3d(0, -260px, 0)';
        },


        /**
         *
         * Unload
         *
         */

        destroy: function () {
            this.swWrapper.removeEventListener('webkitTransitionEnd', this, false);

            this.swFrame.removeEventListener('touchstart', this, false);

            document.getElementById('sw-cancel').removeEventListener('touchstart', this, false);
            document.getElementById('sw-done').removeEventListener('touchstart', this, false);

            document.removeEventListener('touchstart', this, false);
            document.removeEventListener('touchmove', this, false);
            window.removeEventListener('orientationchange', this, true);
            window.removeEventListener('scroll', this, true);

            this.slotData = [];
            this.cancelAction = function () {
                return false;
            };

            this.cancelDone = function () {
                return true;
            };

            this.reset();

            document.body.removeChild(document.getElementById('sw-wrapper'));
        },

        close: function () {
            this.swWrapper.style.webkitTransitionTimingFunction = 'ease-in';
            this.swWrapper.style.webkitTransitionDuration = '400ms';
            this.swWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';

            this.swWrapper.addEventListener('webkitTransitionEnd', this, false);
        },


        /**
         *
         * Generic methods
         *
         */

        addSlot: function (values, style, defaultValue) {
            if (!style) {
                style = '';
            }

            style = style.split(' ');

            for (var i = 0; i < style.length; i += 1) {
                style[i] = 'sw-' + style[i];
            }

            style = style.join(' ');

            var obj = { 'values': values, 'style': style, 'defaultValue': defaultValue };
            this.slotData.push(obj);
        },

        getSelectedValues: function () {
            var index, count,
                i, l,
                keys = [], values = [];

            for (i in this.slotEl) {
                // Remove any residual animation
                this.slotEl[i].removeEventListener('webkitTransitionEnd', this, false);
                this.slotEl[i].style.webkitTransitionDuration = '0';

                if (this.slotEl[i].slotYPosition > 0) {
                    this.setPosition(i, 0);
                } else if (this.slotEl[i].slotYPosition < this.slotEl[i].slotMaxScroll) {
                    this.setPosition(i, this.slotEl[i].slotMaxScroll);
                }

                index = -Math.round(this.slotEl[i].slotYPosition / this.cellHeight);

                count = 0;
                for (l in this.slotData[i].values) {
                    if (count == index) {
                        keys.push(l);
                        values.push(this.slotData[i].values[l]);
                        break;
                    }

                    count += 1;
                }
            }

            return { 'keys': keys, 'values': values };
        },


        /**
         *
         * Rolling slots
         *
         */

        setPosition: function (slot, pos) {
            this.slotEl[slot].slotYPosition = pos;
            this.slotEl[slot].style.webkitTransform = 'translate3d(0, ' + pos + 'px, 0)';
        },

        scrollStart: function (e) {
            // Find the clicked slot
            var xPos = e.targetTouches[0].clientX - this.swSlots.offsetLeft;	// Clicked position minus left offset (should be 11px)

            // Find tapped slot
            var slot = 0;
            for (var i = 0; i < this.slotEl.length; i += 1) {
                slot += this.slotEl[i].slotWidth;

                if (xPos < slot) {
                    this.activeSlot = i;
                    break;
                }
            }

            // If slot is readonly do nothing
            if (this.slotData[this.activeSlot].style.match('readonly')) {
                this.swFrame.removeEventListener('touchmove', this, false);
                this.swFrame.removeEventListener('touchend', this, false);
                return false;
            }

            this.slotEl[this.activeSlot].removeEventListener('webkitTransitionEnd', this, false);	// Remove transition event (if any)
            this.slotEl[this.activeSlot].style.webkitTransitionDuration = '0';		// Remove any residual transition

            // Stop and hold slot position
            var theTransform = window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
            theTransform = new WebKitCSSMatrix(theTransform).m42;
            if (theTransform != this.slotEl[this.activeSlot].slotYPosition) {
                this.setPosition(this.activeSlot, theTransform);
            }

            this.startY = e.targetTouches[0].clientY;
            this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
            this.scrollStartTime = e.timeStamp;

            this.swFrame.addEventListener('touchmove', this, false);
            this.swFrame.addEventListener('touchend', this, false);

            return true;
        },

        scrollMove: function (e) {
            var topDelta = e.targetTouches[0].clientY - this.startY;

            if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                topDelta /= 2;
            }

            this.setPosition(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition + topDelta);
            this.startY = e.targetTouches[0].clientY;

            // Prevent slingshot effect
            if (e.timeStamp - this.scrollStartTime > 80) {
                this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
                this.scrollStartTime = e.timeStamp;
            }
        },

        scrollEnd: function (e) {
            this.swFrame.removeEventListener('touchmove', this, false);
            this.swFrame.removeEventListener('touchend', this, false);

            // If we are outside of the boundaries, let's go back to the sheepfold
            if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                this.scrollTo(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition > 0 ? 0 : this.slotEl[this.activeSlot].slotMaxScroll);
                return false;
            }

            // Lame formula to calculate a fake deceleration
            var scrollDistance = this.slotEl[this.activeSlot].slotYPosition - this.scrollStartY;

            // The drag session was too short
            if (scrollDistance < this.cellHeight / 1.5 && scrollDistance > -this.cellHeight / 1.5) {
                if (this.slotEl[this.activeSlot].slotYPosition % this.cellHeight) {
                    this.scrollTo(this.activeSlot, Math.round(this.slotEl[this.activeSlot].slotYPosition / this.cellHeight) * this.cellHeight, '100ms');
                }

                return false;
            }

            var scrollDuration = e.timeStamp - this.scrollStartTime;

            var newDuration = (2 * scrollDistance / scrollDuration) / this.friction;
            var newScrollDistance = (this.friction / 2) * (newDuration * newDuration);

            if (newDuration < 0) {
                newDuration = -newDuration;
                newScrollDistance = -newScrollDistance;
            }

            var newPosition = this.slotEl[this.activeSlot].slotYPosition + newScrollDistance;

            if (newPosition > 0) {
                // Prevent the slot to be dragged outside the visible area (top margin)
                newPosition /= 2;
                newDuration /= 3;

                if (newPosition > this.swSlotWrapper.clientHeight / 4) {
                    newPosition = this.swSlotWrapper.clientHeight / 4;
                }
            } else if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                // Prevent the slot to be dragged outside the visible area (bottom margin)
                newPosition = (newPosition - this.slotEl[this.activeSlot].slotMaxScroll) / 2 + this.slotEl[this.activeSlot].slotMaxScroll;
                newDuration /= 3;

                if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4) {
                    newPosition = this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4;
                }
            } else {
                newPosition = Math.round(newPosition / this.cellHeight) * this.cellHeight;
            }

            this.scrollTo(this.activeSlot, Math.round(newPosition), Math.round(newDuration) + 'ms');

            return true;
        },

        scrollTo: function (slotNum, dest, runtime) {
            this.slotEl[slotNum].style.webkitTransitionDuration = runtime ? runtime : '100ms';
            this.setPosition(slotNum, dest ? dest : 0);

            // If we are outside of the boundaries go back to the sheepfold
            if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
                this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
            }
        },

        scrollToValue: function (slot, value) {
            var yPos, count, i;

            this.slotEl[slot].removeEventListener('webkitTransitionEnd', this, false);
            this.slotEl[slot].style.webkitTransitionDuration = '0';

            count = 0;
            for (i in this.slotData[slot].values) {
                if (i == value) {
                    yPos = count * this.cellHeight;
                    this.setPosition(slot, yPos);
                    break;
                }

                count -= 1;
            }
        },

        backWithinBoundaries: function (e) {
            e.target.removeEventListener('webkitTransitionEnd', this, false);

            this.scrollTo(e.target.slotPosition, e.target.slotYPosition > 0 ? 0 : e.target.slotMaxScroll, '150ms');
            return false;
        },


        /**
         *
         * Buttons
         *
         */

        tapDown: function (e) {
            e.currentTarget.addEventListener('touchmove', this, false);
            e.currentTarget.addEventListener('touchend', this, false);
            e.currentTarget.className = 'sw-pressed';
        },

        tapCancel: function (e) {
            e.currentTarget.removeEventListener('touchmove', this, false);
            e.currentTarget.removeEventListener('touchend', this, false);
            e.currentTarget.className = '';
        },

        tapUp: function (e) {
            this.tapCancel(e);

            if (e.currentTarget.id == 'sw-cancel') {
                this.cancelAction();
            } else {
                this.doneAction();
            }

            this.close();
        },

        setCancelAction: function (action) {
            this.cancelAction = action;
        },

        setDoneAction: function (action) {
            this.doneAction = action;
        },

        cancelAction: function () {
            return false;
        },

        cancelDone: function () {
            return true;
        }

    }
});