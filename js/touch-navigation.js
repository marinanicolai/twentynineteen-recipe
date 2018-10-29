/**
 * Touch navigation.
 *
 * Contains handlers for navigation on Touch devices.
 */

(function() {

	// Toggle Aria Expanded state for screenreaders
	function toggleAriaExpandedState( menuItems ) {
		'use strict';

		var getMenuItem = menuItems;
		var i;

    	for (i = 0; i < getMenuItem.length; i++) {

			var state = getMenuItem[i].getAttribute('aria-expanded');

			if (state === 'true') {
				state = 'false';
			} else {
				state = 'true';
			}

			getMenuItem[i].setAttribute('aria-expanded', state);
		}
	}

  	// Toggle `focus` class to allow submenu access on tablets.
	function toggleSubmenuTouchScreen() {
		'use strict';

		var siteNavigation = document.querySelector('.main-navigation > div > ul');
		var openSubMenu    = document.querySelectorAll('.mobile-submenu-expand');
		var closeSubMenu   = document.querySelectorAll('.menu-item-link-return');
		var i;
		var u;

		// Check for submenus and bail if none exist
		if ( ! siteNavigation || ! siteNavigation.children ) {
			return;
		}

		// Open submenus on touch
		for ( i = 0; i < openSubMenu.length; i++) {

			openSubMenu[i].addEventListener('touchstart', function() {

				this.addEventListener('touchend', function() {
					var menuItem     = this.closest('.menu-item'); // this.parentNode
					var menuItemAria = menuItem.querySelectorAll('a[aria-expanded]');

					menuItem.classList.add('focus');
					menuItem.lastElementChild.classList.add('expanded-true');

					toggleAriaExpandedState( menuItemAria );
				});
			});
		}

		// Close sub-menus or sub-sub-menus on touch
		for ( u = 0; u < closeSubMenu.length; u++) {

			closeSubMenu[u].addEventListener('touchstart', function() {

				this.addEventListener('touchend', function() {

					var menuItem       = this.closest('.menu-item'); // this.parentNode
					var nearestSubMenu = this.closest('.sub-menu');

					// If this is in a sub-sub-menu, go back to parent sub-menu
					if ( this.closest('ul').classList.contains('sub-menu') ) {

						var menuItemAria = this.closest('.menu-item').querySelectorAll('a[aria-expanded]');

						nearestSubMenu.classList.remove('expanded-true');
						toggleAriaExpandedState( menuItemAria );

					// Or else close all sub-menus
					} else {

						var menuItemAria = this.closest('.menu-item').querySelectorAll('a[aria-expanded]');

						menuItem.classList.remove('focus');
						menuItem.lastElementChild.classList.remove('expanded-true');
						toggleAriaExpandedState( menuItemAria );
					}
				});
			});
		}

		siteNavigation.blur();
	}

	// Debounce
	function debounce(func, wait, immediate) {
		'use strict';

		var timeout;
		wait      = (typeof wait !== 'undefined') ? wait : 20;
		immediate = (typeof immediate !== 'undefined') ? immediate : true;

		return function() {

			var context = this, args = arguments;
			var later = function() {
				timeout = null;

				if (!immediate) {
					func.apply(context, args);
				}
			};

			var callNow = immediate && !timeout;

			clearTimeout(timeout);
			timeout = setTimeout(later, wait);

			if (callNow) {
				func.apply(context, args);
			}
		};
	}

	// Run our functions once the window has loaded fully
	window.addEventListener('load', function() {
		toggleSubmenuTouchScreen();
	});

	// Annnnnd also every time the window resizes
	var isResizing = false;
	window.addEventListener('resize', debounce( function() {
		if (isResizing) {
			return;
		}

		isResizing = true;
		setTimeout( function() {
			toggleSubmenuTouchScreen();
			isResizing = false;
		}, 150 );
	}));

})();
