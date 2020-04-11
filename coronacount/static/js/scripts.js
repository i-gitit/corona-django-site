// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
 	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};


/* JS Utility Classes */
(function() {
  // make focus ring visible only for keyboard navigation (i.e., tab key) 
  var focusTab = document.getElementsByClassName('js-tab-focus');
  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusTabs(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusTabs(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
  };

  function resetFocusTabs(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };
  window.addEventListener('mousedown', detectClick);
}());
// File#: _1_back-to-top
// Usage: codyhouse.co/license
(function() {
  var backTop = document.getElementsByClassName('js-back-to-top')[0];
  if( backTop ) {
    var dataElement = backTop.getAttribute('data-element');
    var scrollElement = dataElement ? document.querySelector(dataElement) : window;
    var scrollDuration = parseInt(backTop.getAttribute('data-duration')) || 300, //scroll to top duration
      scrollOffset = parseInt(backTop.getAttribute('data-offset')) || 0, //show back-to-top if scrolling > scrollOffset
      scrolling = false;

    //detect click on back-to-top link
    backTop.addEventListener('click', function(event) {
      event.preventDefault();
      if(!window.requestAnimationFrame) {
        scrollElement.scrollTo(0, 0);
      } else {
        dataElement ? Util.scrollTo(0, scrollDuration, false, scrollElement) : Util.scrollTo(0, scrollDuration);
      }
      //move the focus to the #top-element - don't break keyboard navigation
      Util.moveFocus(document.getElementById(backTop.getAttribute('href').replace('#', '')));
    });

    //listen to the window scroll and update back-to-top visibility
    checkBackToTop();
    if (scrollOffset > 0) {
      scrollElement.addEventListener("scroll", function(event) {
        if( !scrolling ) {
          scrolling = true;
          (!window.requestAnimationFrame) ? setTimeout(function(){checkBackToTop();}, 250) : window.requestAnimationFrame(checkBackToTop);
        }
      });
    }

    function checkBackToTop() {
      var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
      if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
      Util.toggleClass(backTop, 'back-to-top--is-visible', windowTop >= scrollOffset);
      scrolling = false;
    }
  }
}());

// File#: _1_circular-progress-bar
// Usage: codyhouse.co/license
(function() {
  var CProgressBar = function(element) {
    this.element = element;
    this.fill = this.element.getElementsByClassName('c-progress-bar__fill')[0];
    this.fillLength = getProgressBarFillLength(this);
    this.label = this.element.getElementsByClassName('js-c-progress-bar__value');
    this.value = parseInt(this.element.getAttribute('data-progress'));
    // before checking if data-animation is set -> check for reduced motion
    updatedProgressBarForReducedMotion(this);
    this.animate = this.element.hasAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on';
    this.animationDuration = this.element.hasAttribute('data-duration') ? this.element.getAttribute('data-duration') : 1000;
    // animation will run only on browsers supporting IntersectionObserver
    this.canAnimate = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    // this element is used to announce the percentage value to SR
    this.ariaLabel = this.element.getElementsByClassName('js-c-progress-bar__aria-value');
    // check if we need to update the bar color
    this.changeColor =  Util.hasClass(this.element, 'c-progress-bar--color-update') && Util.cssSupports('color', 'var(--color-value)');
    if(this.changeColor) {
      this.colorThresholds = getProgressBarColorThresholds(this);
    }
    initProgressBar(this);
    // store id to reset animation
    this.animationId = false;
  };

  // public function
  CProgressBar.prototype.setProgressBarValue = function(value) {
    setProgressBarValue(this, value);
  };

  function getProgressBarFillLength(progressBar) {
    return parseFloat(2*Math.PI*progressBar.fill.getAttribute('r')).toFixed(2);
  };

  function getProgressBarColorThresholds(progressBar) {
    var thresholds = [];
    var i = 1;
    while (!isNaN(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--c-progress-bar-color-'+i)))) {
      thresholds.push(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--c-progress-bar-color-'+i)));
      i = i + 1;
    }
    return thresholds;
  };

  function updatedProgressBarForReducedMotion(progressBar) {
    // if reduced motion is supported and set to reduced -> remove animations
    if(osHasReducedMotion) progressBar.element.removeAttribute('data-animation');
  };

  function initProgressBar(progressBar) {
    // set shape initial dashOffset
    setShapeOffset(progressBar);
    // set initial bar color
    if(progressBar.changeColor) updateProgressBarColor(progressBar, progressBar.value);
    // if data-animation is on -> reset the progress bar and animate when entering the viewport
    if(progressBar.animate && progressBar.canAnimate) animateProgressBar(progressBar);
    else setProgressBarValue(progressBar, progressBar.value);
    // reveal fill and label -> --animate and --color-update variations only
    setTimeout(function(){Util.addClass(progressBar.element, 'c-progress-bar--init');}, 30);

    // dynamically update value of progress bar
    progressBar.element.addEventListener('updateProgress', function(event){
      // cancel request animation frame if it was animating
      if(progressBar.animationId) window.cancelAnimationFrame(progressBar.animationId);

      var final = event.detail.value,
        duration = (event.detail.duration) ? event.detail.duration : progressBar.animationDuration;
      var start = getProgressBarValue(progressBar);
      // trigger update animation
      updateProgressBar(progressBar, start, final, duration, function(){
        emitProgressBarEvents(progressBar, 'progressCompleted', progressBar.value+'%');
        // update value of label for SR
        if(progressBar.ariaLabel.length > 0) progressBar.ariaLabel[0].textContent = final+'%';
      });
    });
  };

  function setShapeOffset(progressBar) {
    var center = progressBar.fill.getAttribute('cx');
    progressBar.fill.setAttribute('transform', "rotate(-90 "+center+" "+center+")");
    progressBar.fill.setAttribute('stroke-dashoffset', progressBar.fillLength);
    progressBar.fill.setAttribute('stroke-dasharray', progressBar.fillLength);
  };

  function animateProgressBar(progressBar) {
    // reset inital values
    setProgressBarValue(progressBar, 0);

    // listen for the element to enter the viewport -> start animation
    var observer = new IntersectionObserver(progressBarObserve.bind(progressBar), { threshold: [0, 0.1] });
    observer.observe(progressBar.element);
  };

  function progressBarObserve(entries, observer) { // observe progressBar position -> start animation when inside viewport
    var self = this;
    if(entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
      updateProgressBar(this, 0, this.value, this.animationDuration, function(){
        emitProgressBarEvents(self, 'progressCompleted', self.value+'%');
      });
    }
  };

  function setProgressBarValue(progressBar, value) {
    var offset = ((100 - value)*progressBar.fillLength/100).toFixed(2);
    progressBar.fill.setAttribute('stroke-dashoffset', offset);
    if(progressBar.label.length > 0 ) progressBar.label[0].textContent = value;
    if(progressBar.changeColor) updateProgressBarColor(progressBar, value);
  };

  function updateProgressBar(progressBar, start, to, duration, cb) {
    var change = to - start,
      currentTime = null;

    var animateFill = function(timestamp){
      if (!currentTime) currentTime = timestamp;
      var progress = timestamp - currentTime;
      var val = parseInt((progress/duration)*change + start);
      // make sure value is in correct range
      if(change > 0 && val > to) val = to;
      if(change < 0 && val < to) val = to;

      setProgressBarValue(progressBar, val);
      if(progress < duration) {
        progressBar.animationId = window.requestAnimationFrame(animateFill);
      } else {
        progressBar.animationId = false;
        cb();
      }
    };
    if ( window.requestAnimationFrame && !osHasReducedMotion ) {
      progressBar.animationId = window.requestAnimationFrame(animateFill);
    } else {
      setProgressBarValue(progressBar, to);
      cb();
    }
  };

  function updateProgressBarColor(progressBar, value) {
    var className = 'c-progress-bar--fill-color-'+ progressBar.colorThresholds.length;
    for(var i = progressBar.colorThresholds.length; i > 0; i--) {
      if( !isNaN(progressBar.colorThresholds[i - 1]) && value <= progressBar.colorThresholds[i - 1]) {
        className = 'c-progress-bar--fill-color-' + i;
      }
    }

    removeProgressBarColorClasses(progressBar);
    Util.addClass(progressBar.element, className);
  };

  function removeProgressBarColorClasses(progressBar) {
    var classes = progressBar.element.className.split(" ").filter(function(c) {
      return c.lastIndexOf('c-progress-bar--fill-color-', 0) !== 0;
    });
    progressBar.element.className = classes.join(" ").trim();
  };

  function getProgressBarValue(progressBar) {
    return (100 - Math.round((parseFloat(progressBar.fill.getAttribute('stroke-dashoffset'))/progressBar.fillLength)*100));
  };

  function emitProgressBarEvents(progressBar, eventName, detail) {
    progressBar.element.dispatchEvent(new CustomEvent(eventName, {detail: detail}));
  };

  window.CProgressBar = CProgressBar;

  //initialize the CProgressBar objects
  var circularProgressBars = document.getElementsByClassName('js-c-progress-bar');
  var osHasReducedMotion = Util.osHasReducedMotion();
  if( circularProgressBars.length > 0 ) {
    for( var i = 0; i < circularProgressBars.length; i++) {
      (function(i){new CProgressBar(circularProgressBars[i]);})(i);
    }
  }
}());

// File#: _1_countup
// Usage: codyhouse.co/license
(function() {
  var CountUp = function(opts) {
    this.options = Util.extend(CountUp.defaults , opts);
    this.element = this.options.element;
    this.initialValue = parseFloat(this.options.initial);
    this.finalValue = parseFloat(this.element.textContent);
    this.intervalId;
    this.animationTriggered = false;
    // animation will run only on browsers supporting IntersectionObserver
    this.canAnimate = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    initCountUp(this);
  };

  CountUp.prototype.reset = function() { // reset element to its initial value
    if(!this.canAnimate) return;
    window.cancelAnimationFrame(this.intervalId);
    this.element.textContent = this.initialValue;
  };

  CountUp.prototype.restart = function() { // restart element animation
    countUpAnimate(this);
  };

  function initCountUp(countup) {
    if(!countup.canAnimate) { // IntersectionObserver not supported
      countUpShow(countup);
      return;
    }

    // reset countUp for SR
    initCountUpSr(countup);

    // listen for the element to enter the viewport -> start animation
    var observer = new IntersectionObserver(countupObserve.bind(countup), { threshold: [0, 0.1] });
    observer.observe(countup.element);

    // listen to events
    countup.element.addEventListener('countUpReset', function(){countup.reset();});
    countup.element.addEventListener('countUpRestart', function(){countup.restart();});
  };

  function countUpShow(countup) { // reveal countup after it has been initialized
    Util.addClass(countup.element.closest('.countup'), 'countup--is-visible');
  };

  function countupObserve(entries, observer) { // observe countup position -> start animation when inside viewport
    if(entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
      countUpAnimate(this);
    }
  };

  function countUpAnimate(countup) { // animate countup
    countup.element.textContent = countup.initialValue;
    countUpShow(countup);
    window.cancelAnimationFrame(countup.intervalId);
    var currentTime = null;

    function runCountUp(timestamp) {
      if (!currentTime) currentTime = timestamp;
      var progress = timestamp - currentTime;
      if(progress > countup.options.duration) progress = countup.options.duration;
      var val = getValEaseOut(progress, countup.initialValue, countup.finalValue - countup.initialValue, countup.options.duration);
      countup.element.textContent = getCountUpValue(val, countup);
      if(progress < countup.options.duration) {
        countup.intervalId = window.requestAnimationFrame(runCountUp);
      } else {
        countUpComplete(countup);
      }
    };

    countup.intervalId = window.requestAnimationFrame(runCountUp);
  };

  function getCountUpValue(val, countup) { // reset new countup value to proper decimal places+separator
    if(countup.options.decimal) {val = parseFloat(val.toFixed(countup.options.decimal));}
    else {val = parseInt(val);}
    if(countup.options.separator) val = val.toLocaleString('en');
    return val;
  }

  function countUpComplete(countup) { // emit event when animation is over
    countup.element.dispatchEvent(new CustomEvent('countUpComplete'));
    countup.animationTriggered = true;
  };

  function initCountUpSr(countup) { // make sure countup is accessible
    // hide elements that will be animated to SR
    countup.element.setAttribute('aria-hidden', 'true');
    // create new element with visible final value - accessible to SR only
    var srValue = document.createElement('span');
    srValue.textContent = countup.finalValue;
    Util.addClass(srValue, 'sr-only');
    countup.element.parentNode.insertBefore(srValue, countup.element.nextSibling);
  };

  function getValEaseOut(t, b, c, d) {
    t /= d;
    return -c * t*(t-2) + b;
  };

  CountUp.defaults = {
    element : '',
    separator : false,
    duration: 3000,
    decimal: false,
    initial: 0
  };

  window.CountUp = CountUp;

  //initialize the CountUp objects
  var countUp = document.getElementsByClassName('js-countup');
  if( countUp.length > 0 ) {
    for( var i = 0; i < countUp.length; i++) {(function(i){
    	var separator = (countUp[i].getAttribute('data-countup-sep')) ? countUp[i].getAttribute('data-countup-sep') : false,
        // duration = (countUp[i].getAttribute('data-countup-duration')) ? countUp[i].getAttribute('data-countup-duration') : CountUp.defaults.duration,
        duration = 2000,
        decimal = (countUp[i].getAttribute('data-countup-decimal')) ? countUp[i].getAttribute('data-countup-decimal') : false,
    		initial = (countUp[i].getAttribute('data-countup-start')) ? countUp[i].getAttribute('data-countup-start') : 0;
    	new CountUp({element: countUp[i], separator : separator, duration: duration, decimal: decimal, initial: initial});
    })(i);}
  }
}());

// File#: _1_header
// Usage: codyhouse.co/license
(function() {
  var mainHeader = document.getElementsByClassName('js-header')[0];
  if( mainHeader ) {
    var trigger = mainHeader.getElementsByClassName('js-header__trigger')[0],
      nav = mainHeader.getElementsByClassName('js-header__nav')[0];

    // we'll use these to store the node that needs to receive focus when the mobile menu is closed
    var focusMenu = false;

    //detect click on nav trigger
    trigger.addEventListener("click", function(event) {
      event.preventDefault();
      var ariaExpanded = !Util.hasClass(nav, 'header__nav--is-visible');
      //show nav and update button aria value
      Util.toggleClass(nav, 'header__nav--is-visible', ariaExpanded);
      trigger.setAttribute('aria-expanded', ariaExpanded);
      if(ariaExpanded) { //opening menu -> move focus to first element inside nav
        nav.querySelectorAll('[href], input:not([disabled]), button:not([disabled])')[0].focus();
      } else if(focusMenu) {
        focusMenu.focus();
        focusMenu = false;
      }
    });
    // listen for key events
    window.addEventListener('keyup', function(event){
      // listen for esc key
      if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
        // close navigation on mobile if open
        if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger)) {
          focusMenu = trigger; // move focus to menu trigger when menu is close
          trigger.click();
        }
      }
      // listen for tab key
      if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
        // close navigation on mobile if open when nav loses focus
        if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger) && !document.activeElement.closest('.js-header')) trigger.click();
      }
    });
  }

  function isVisible(element) {
    return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  };
}());

// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
  var Modal = function(element) {
    this.element = element;
    this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.showClass = "modal--is-visible";
    this.initModal();
  };

  Modal.prototype.initModal = function() {
    var self = this;
    //open modal when clicking on trigger buttons
    if ( this.triggers ) {
      for(var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].addEventListener('click', function(event) {
          event.preventDefault();
          self.selectedTrigger = event.target;
          self.showModal();
          self.initModalEvents();
        });
      }
    }

    // listen to the openModal event -> open modal without a trigger button
    this.element.addEventListener('openModal', function(event){
      if(event.detail) self.selectedTrigger = event.detail;
      self.showModal();
      self.initModalEvents();
    });

    // listen to the closeModal event -> close modal without a trigger button
    this.element.addEventListener('closeModal', function(event){
      if(event.detail) self.selectedTrigger = event.detail;
      self.closeModal();
    });
  };

  Modal.prototype.showModal = function() {
    var self = this;
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    this.firstFocusable.focus();
    // wait for the end of transitions before moving focus
    this.element.addEventListener("transitionend", function cb(event) {
      self.firstFocusable.focus();
      self.element.removeEventListener("transitionend", cb);
    });
    this.emitModalEvents('modalIsOpen');
  };

  Modal.prototype.closeModal = function() {
    if(!Util.hasClass(this.element, this.showClass)) return;
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    if(this.selectedTrigger) this.selectedTrigger.focus();
    //remove listeners
    this.cancelModalEvents();
    this.emitModalEvents('modalIsClose');
  };

  Modal.prototype.initModalEvents = function() {
    //add event listeners
    this.element.addEventListener('keydown', this);
    this.element.addEventListener('click', this);
  };

  Modal.prototype.cancelModalEvents = function() {
    //remove event listeners
    this.element.removeEventListener('keydown', this);
    this.element.removeEventListener('click', this);
  };

  Modal.prototype.handleEvent = function (event) {
    switch(event.type) {
      case 'click': {
        this.initClick(event);
      }
      case 'keydown': {
        this.initKeyDown(event);
      }
    }
  };

  Modal.prototype.initKeyDown = function(event) {
    if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside modal
      this.trapFocus(event);
    } else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
      event.preventDefault();
      this.closeModal(); // close modal when pressing Enter on close button
    }
  };

  Modal.prototype.initClick = function(event) {
    //close modal when clicking on close button or modal bg layer
    if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
    event.preventDefault();
    this.closeModal();
  };

  Modal.prototype.trapFocus = function(event) {
    if( this.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of modal
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if( this.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of modal
      event.preventDefault();
      this.firstFocusable.focus();
    }
  }

  Modal.prototype.getFocusableElements = function() {
    //get all focusable elements inside the modal
    var allFocusable = this.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
  };

  Modal.prototype.getFirstVisible = function(elements) {
    //get first visible focusable element inside the modal
    for(var i = 0; i < elements.length; i++) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        this.firstFocusable = elements[i];
        return true;
      }
    }
  };

  Modal.prototype.getLastVisible = function(elements) {
    //get last visible focusable element inside the modal
    for(var i = elements.length - 1; i >= 0; i--) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        this.lastFocusable = elements[i];
        return true;
      }
    }
  };

  Modal.prototype.emitModalEvents = function(eventName) {
    var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
    this.element.dispatchEvent(event);
  };

  //initialize the Modal objects
  var modals = document.getElementsByClassName('js-modal');
  if( modals.length > 0 ) {
    var modalArrays = [];
    for( var i = 0; i < modals.length; i++) {
      (function(i){modalArrays.push(new Modal(modals[i]));})(i);
    }

    window.addEventListener('keydown', function(event){ //close modal window on esc
      if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
        for( var i = 0; i < modalArrays.length; i++) {
          (function(i){modalArrays[i].closeModal();})(i);
        };
      }
    });
  }
}());

// File#: _1_off-canvas-content
// Usage: codyhouse.co/license
(function() {
  var OffCanvas = function(element) {
    this.element = element;
    this.wrapper = document.getElementsByClassName('js-off-canvas')[0];
    this.main = document.getElementsByClassName('off-canvas__main')[0];
    this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.closeBtn = this.element.getElementsByClassName('js-off-canvas__close-btn');
    this.selectedTrigger = false;
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.animating = false;
    initOffCanvas(this);
  };

  function initOffCanvas(panel) {
    panel.element.setAttribute('aria-hidden', 'true');
    for(var i = 0 ; i < panel.triggers.length; i++) { // lister to the click on off-canvas content triggers
      panel.triggers[i].addEventListener('click', function(event){
        panel.selectedTrigger = event.currentTarget;
        event.preventDefault();
        togglePanel(panel);
      });
    }
  };

  function togglePanel(panel) {
    var status = (panel.element.getAttribute('aria-hidden') == 'true') ? 'close' : 'open';
    if(status == 'close') openPanel(panel);
    else closePanel(panel);
  };

  function openPanel(panel) {
    if(panel.animating) return; // already animating
    emitPanelEvents(panel, 'openPanel', '');
    panel.animating = true;
    panel.element.setAttribute('aria-hidden', 'false');
    Util.addClass(panel.wrapper, 'off-canvas--visible');
    getFocusableElements(panel);
    var transitionEl = panel.element;
    if(panel.closeBtn.length > 0 && !Util.hasClass(panel.closeBtn[0], 'js-off-canvas__a11y-close-btn')) transitionEl = 	panel.closeBtn[0];
    transitionEl.addEventListener('transitionend', function cb(){
      // wait for the end of transition to move focus and update the animating property
      panel.animating = false;
      Util.moveFocus(panel.element);
      transitionEl.removeEventListener('transitionend', cb);
    });
    if(!transitionSupported) panel.animating = false;
    initPanelEvents(panel);
  };

  function closePanel(panel, bool) {
    if(panel.animating) return;
    panel.animating = true;
    panel.element.setAttribute('aria-hidden', 'true');
    Util.removeClass(panel.wrapper, 'off-canvas--visible');
    panel.main.addEventListener('transitionend', function cb(){
      panel.animating = false;
      if(panel.selectedTrigger) panel.selectedTrigger.focus();
      setTimeout(function(){panel.selectedTrigger = false;}, 10);
      panel.main.removeEventListener('transitionend', cb);
    });
    if(!transitionSupported) panel.animating = false;
    cancelPanelEvents(panel);
    emitPanelEvents(panel, 'closePanel', bool);
  };

  function initPanelEvents(panel) { //add event listeners
    panel.element.addEventListener('keydown', handleEvent.bind(panel));
    panel.element.addEventListener('click', handleEvent.bind(panel));
  };

  function cancelPanelEvents(panel) { //remove event listeners
    panel.element.removeEventListener('keydown', handleEvent.bind(panel));
    panel.element.removeEventListener('click', handleEvent.bind(panel));
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'keydown':
        initKeyDown(this, event);
        break;
      case 'click':
        initClick(this, event);
        break;
    }
  };

  function initClick(panel, event) { // close panel when clicking on close button
    if( !event.target.closest('.js-off-canvas__close-btn')) return;
    event.preventDefault();
    closePanel(panel, 'close-btn');
  };

  function initKeyDown(panel, event) {
    if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
      //close off-canvas panel on esc
      closePanel(panel, 'key');
    } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
      //trap focus inside panel
      trapFocus(panel, event);
    }
  };

  function trapFocus(panel, event) {
    if( panel.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of panel
      event.preventDefault();
      panel.lastFocusable.focus();
    }
    if( panel.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of panel
      event.preventDefault();
      panel.firstFocusable.focus();
    }
  };

  function getFocusableElements(panel) { //get all focusable elements inside the off-canvas content
    var allFocusable = panel.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    getFirstVisible(panel, allFocusable);
    getLastVisible(panel, allFocusable);
  };

  function getFirstVisible(panel, elements) { //get first visible focusable element inside the off-canvas content
    for(var i = 0; i < elements.length; i++) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        panel.firstFocusable = elements[i];
        return true;
      }
    }
  };

  function getLastVisible(panel, elements) { //get last visible focusable element inside the off-canvas content
    for(var i = elements.length - 1; i >= 0; i--) {
      if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
        panel.lastFocusable = elements[i];
        return true;
      }
    }
  };

  function emitPanelEvents(panel, eventName, target) { // emit custom event
    var event = new CustomEvent(eventName, {detail: target});
    panel.element.dispatchEvent(event);
  };

  //initialize the OffCanvas objects
  var offCanvas = document.getElementsByClassName('js-off-canvas__panel'),
    transitionSupported = Util.cssSupports('transition');
  if( offCanvas.length > 0 ) {
    for( var i = 0; i < offCanvas.length; i++) {
      (function(i){new OffCanvas(offCanvas[i]);})(i);
    }
  }
}());

// File#: _1_pre-header
// Usage: codyhouse.co/license
(function() {
  var preHeader = document.getElementsByClassName('js-pre-header');
  if(preHeader.length > 0) {
    for(var i = 0; i < preHeader.length; i++) {
      (function(i){ addPreHeaderEvent(preHeader[i]);})(i);
    }

    function addPreHeaderEvent(element) {
      var close = element.getElementsByClassName('js-pre-header__close-btn')[0];
      if(close) {
        close.addEventListener('click', function(event) {
          event.preventDefault();
          Util.addClass(element, 'pre-header--is-hidden');
        });
      }
    }
  }
}());

// File#: _1_table
// Usage: codyhouse.co/license
(function() {
  function initTable(table) {
    checkTableLayour(table); // switch from a collapsed to an expanded layout
    Util.addClass(table, 'table--loaded'); // show table

    // custom event emitted when window is resized
    table.addEventListener('update-table', function(event){
      checkTableLayour(table);
    });
  };

  function checkTableLayour(table) {
    var layout = getComputedStyle(table, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(table, tableExpandedLayoutClass, layout != 'collapsed');
  };

  var tables = document.getElementsByClassName('js-table'),
    tableExpandedLayoutClass = 'table--expanded';
  if( tables.length > 0 ) {
    var j = 0;
    for( var i = 0; i < tables.length; i++) {
      var beforeContent = getComputedStyle(tables[i], ':before').getPropertyValue('content');
      if(beforeContent && beforeContent !='' && beforeContent !='none') {
        (function(i){initTable(tables[i]);})(i);
        j = j + 1;
      } else {
        Util.addClass(tables[i], 'table--loaded');
      }
    }

    if(j > 0) {
      var resizingId = false,
        customEvent = new CustomEvent('update-table');
      window.addEventListener('resize', function(event){
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 300);
      });

      function doneResizing() {
        for( var i = 0; i < tables.length; i++) {
          (function(i){tables[i].dispatchEvent(customEvent)})(i);
        };
      };
    }
  }
}());
