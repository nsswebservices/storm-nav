var UTILS = {
		attributelist: require('storm-attributelist')
	},
    UI = (function(w, d) {
		'use strict';

		var load = function(src, cb) {
                    var t = document.createElement('script'),
                        s = document.getElementsByTagName('script')[0];
                    t.async = true;
                    t.src = 'https://apis.google.com/js/plusone.js?onload=onLoadCallback';
                    s.parentNode.insertBefore(t, s);
                    t.onload = cb;
            },
            Nav = require('./libs/storm-nav'),
            polyfill = function(){
                load('https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Element.prototype.classList&gated=1', init);
            },
			init = function() {
                var nav = Nav.init('.js-nav');
				console.log(nav);
			};

		return {
			polyfill: polyfill
		};

	})(window, document, undefined);

global.STORM = {
    UTILS: UTILS,
    UI: UI
};

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.polyfill, false);

