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
		triggerEvents = ['click', 'keydown', 'touchstart'],
        defaults = {
            triggerSelector: '.js-nav-trigger',
            targetSelector: '.js-nav-target',
            closeBtnSelector: '.js-nav-close',
            currentClass: 'active',
			active: null
        },
        StormNav = {
			init: function(){
                //construct an object model of the nav indexed by type, then by id??
                /* 
                targetsBySection: {
                    'resources': [],
                    'nature': [],
                    'community': []
                },
                triggersBySection: {
                    'resources': DOMNode,
                    'nature': DOMNode,
                    'community': DOMNode
                }
                */
                this.triggers = [].slice.call(document.querySelectorAll(this.settings.triggerSelector));
                this.targets = [].slice.call(document.querySelectorAll(this.settings.targetSelector));
                this.nav = {};
                this.targetsBySection = {};
                this.triggersBySection = {};
                this.current = this.settings.active;

                this.targets.forEach(function(target){
                    this.targetsBySection[target.getAttribute('id')] = target;
                }.bind(this));

                for(var k in this.targetsBySection) {
                    if(this.targetsBySection.hasOwnProperty(k)) {
                        this.triggersBySection[k] = this.triggers.filter(function(trigger){
                            return ((trigger.getAttribute('href') && trigger.getAttribute('href').substr(1)) || trigger.parentNode.getAttribute('id')) === k;
                        }.bind(this));
                    }
                }

                this.closeBtn = document.querySelector(this.settings.closeBtnSelector);
				this.initAria();
                this.initTriggers();
                this.initCloseBtn();
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
                var initNavGroup = function(t, s){
                        triggerEvents.forEach(function(ev){
                            t.addEventListener(ev, function(e){
                                if(!!e.keyCode && e.keyCode === KEY_CODES.TAB) { return; }
                                if(!!!e.keyCode || e.keyCode === KEY_CODES.RETURN){
                                    e.preventDefault();
                                    this.toggle(s);
                                }
                            }.bind(this), false);
                        }.bind(this));
                    }.bind(this);

                for(var section in this.triggersBySection) {
                    if(this.triggersBySection.hasOwnProperty(section)) {
                        this.triggersBySection[section].forEach(function(trigger){
                            initNavGroup(trigger, section);
                        }.bind(this));
                    }
                }
            },
            toggle: function(section) {
				if(this.current === null) { 
					this.changeTab('open', section);
                    this.current = section;
					return this;
				}
				if(this.current === section) { 
					this.changeTab('close', section);
                    this.current = null;
                    return this;
                }
				 this.changeTab('close', this.current)
					.changeTab('open', section);

                this.current = section;
				return this;
			},
            changeTab: function(type, section) {
                var methods = {
                    open: {
                        classlist: 'add',
                        tabIndex: {
                            target: this.targetsBySection[section],
                            value: '0'
                        }
                    },
                    close: {
                        classlist: 'remove',
                        tabIndex: {
                            target: this.targetsBySection[section],
                            value: '-1'
                        }
                    }
                };

                this.triggersBySection[section].forEach(function(trigger){
                    console.log(trigger);
                    trigger.classList[methods[type].classlist](this.settings.currentClass);
                    STORM.UTILS.attributelist.toggle(trigger, ['aria-selected', 'aria-expanded']);
                }.bind(this));
                this.targetsBySection[section].classList[methods[type].classlist](this.settings.currentClass);
                STORM.UTILS.attributelist.toggle(this.targetsBySection[section], 'aria-hidden');
                STORM.UTILS.attributelist.set(methods[type].tabIndex.target, {
                    'tabIndex': methods[type].tabIndex.value
                });

                return this;
            }
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