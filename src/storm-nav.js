(function(root, factory) {
    if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormNav = factory();
  }
}(this, function() {
	'use strict';
    
    var KEY_CODES = {
            RETURN: 13,
            TAB: 9
        },
        instances = [],
		triggerEvents = ['click', 'keydown', 'touchstart'],
        defaults = {
            tabSelector: '.js-nav-tab',
            titleSelector: '.js-nav-title',
            closeBtnSelector: '.js-nav-close',
            currentClass: 'active',
			active: null
        },
        StormNav = {
			init: function(){
				this.tabs = [].slice.call(this.DOMElement.querySelectorAll(this.settings.tabSelector));
				this.titles = [].slice.call(this.DOMElement.querySelectorAll(this.settings.titleSelector));
				this.triggers = this.titles.concat(this.tabs);
				this.targets = this.tabs.map(function(el){
					return document.getElementById(el.getAttribute('href').substr(1)) || console.error('No subnav elements not found');
				});
                this.closeBtn = this.DOMElement.querySelector(this.settings.closeBtnSelector);
					
                this.current = this.settings.active;
				this.initAria();
				!!this.tabs.length && this.initTriggers(this.tabs);
				!!this.titles.length && this.initTriggers(this.titles);
				!!this.current && this.openTab(this.current);
                !!this.closeBtn && this.initCloseBtn();
                return this;
			},
			initAria: function() {
				this.triggers.forEach(function(el){
					STORM.UTILS.attributelist.set(el, {
						'role' : 'tab',
                        'tabIndex' : 0,
                        'aria-expanded' : false,
                        'aria-selected' : false,
						'aria-controls' : el.getAttribute('href') ? el.getAttribute('href').substr(1) : el.parentNode.getAttribute('id')
					});
				});
				this.targets.forEach(function(el){
					STORM.UTILS.attributelist.set(el, {
						'role' : 'tabpanel',
						'aria-hidden' : true,
						'tabIndex': '-1'
					});
				});
				return this;
			},
            initCloseBtn: function(){
                triggerEvents.forEach(function(ev){
                    this.closeBtn.addEventListener(ev, function(e){
                        e.stopImmediatePropagation();
                        this.current !== null && this.toggle(this.current);
                    }.bind(this), false);
                }.bind(this));
            },
            initTriggers: function(triggers) {
                var handler = function(i){
                    this.toggle(i);
                };

                triggers.forEach(function(el, i){
                    triggerEvents.forEach(function(ev){
                        el.addEventListener(ev, function(e){
                            if(!!e.keyCode && e.keyCode === KEY_CODES.TAB) { return; }
                            if(!!!e.keyCode || e.keyCode === KEY_CODES.RETURN){
                                e.preventDefault();
                                handler.call(this, i);
                            }
                        }.bind(this), false);
                    }.bind(this));
                    
                }.bind(this));

                return this;
            },
            changeTab: function(type, i) {
                var methods = {
                    open: {
                        classlist: 'add',
                        tabIndex: {
                            target: this.targets[i],
                            value: '0'
                        }
                    },
                    close: {
                        classlist: 'remove',
                        tabIndex: {
                            target: this.targets[this.current],
                            value: '-1'
                        }
                    }
                };

                this.tabs[i].classList[methods[type].classlist](this.settings.currentClass);
                this.titles[i].classList[methods[type].classlist](this.settings.currentClass);
                this.targets[i].classList[methods[type].classlist](this.settings.currentClass);
                STORM.UTILS.attributelist.toggle(this.targets[i], 'aria-hidden');
                STORM.UTILS.attributelist.toggle(this.tabs[i], ['aria-selected', 'aria-expanded']);
                STORM.UTILS.attributelist.toggle(this.titles[i], ['aria-selected', 'aria-expanded']);
                STORM.UTILS.attributelist.set(methods[type].tabIndex.target, {
                    'tabIndex': methods[type].tabIndex.value
                });
            },
            openTab: function(i) {
                this.changeTab('open', i);
                this.current = i;
                return this;
            },
            closeTab: function(i) {
                this.changeTab('close', i);
                return this;
            },
            toggle: function(i) {
				if(this.current === i) { 
                    this.closeTab(this.current)
                    this.current = null;
                    return this;
                }
				if(this.current === null) { 
					this.openTab(i);
					return this;
				}
				 this.closeTab(this.current)
					.openTab(i);
				return this;
			},
            open: function(url){},
            close: function(url){}
		};
    
    function init(sel, opts) {
        var el = document.querySelector(sel);
        if(el.length === 0 || el.length > 1) {
            console.warn('Nav element must match a single DOM node');
            return;
        }
        
        return Object.assign(Object.create(StormNav), {
                DOMElement: el,
                settings: Object.assign({}, defaults, opts)
            }).init();
    }
    
	return {
		init: init
	};
	
 }));