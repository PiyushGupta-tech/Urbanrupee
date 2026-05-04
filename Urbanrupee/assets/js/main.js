/* ============================================================
    [Mastering JavaScript]

    Theme Name  : HavioTop        
    Description : HavioTop - Online Recharge & Payment Platform.
    Author      : coUI         
    Author URL  : https://themeforest.net/user/coui  
    Version     : 1.0.1

============================================================== */
/*
========================================
*********** TABLE OF CONTENTS **********
 
    01. Header Hide Click On Body
    02. Header Sticky
    03. Scroll To Top
    04. Header Hide Scroll Bar
    05. Small Device Header Menu
    06. Add Attribute For Bg Image
    07. add active class to ul>li
    08. Text Circle
    09. Nice Select
    10. Owl Carousel
    11. Counter
    12. Sidebar Menu
    13. Service
    14. FAQ
    15. AOS
    16. GSAP Code
      - Hero section
      - App section
      - Counter section
      - Blog Details section
      - Service Accordion
      - Hero section
      - Hero section
    17. Cursor
    18. Preloader

========================================
*/

(function ($) {
  'use strict';

  function urPrefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function urThrottleRaf(fn) {
    var scheduled = false;
    return function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        fn();
      });
    };
  }

  // ============== Header Hide Click On Body Js Start ========
  $('.header-button').on('click', function () {
    $('.body-overlay').toggleClass('show');
  });
  $('.body-overlay').on('click', function () {
    $('.header-button').trigger('click');
    $(this).removeClass('show');
  });
  // =============== Header Hide Click On Body Js End =========

  // // ========================= Header Sticky Js Start ==============
  /** Sections whose backdrop sits behind the transparent header — desktop contrast probe */
  var UR_NAV_DARK_BG_SELECTOR =
    [
      '.feature__area.ur-features-fintech',
      '.why-choose-modern.ur-why-choose-dark',
      '.banner__area.ur-services-banner',
      '.banner__area.ur-wl-hero',
      '.banner__area.blog-banner',
      '.contact__page.ur-contact-page-shell'
    ].join(',');

  function urHeaderOverlapsDarkBackdrop() {
    if (window.innerWidth < 992) return false;
    var header = document.querySelector('.header');
    if (!header) return false;
    var navMenu = header.querySelector('.nav-menu');
    var rect = navMenu && navMenu.getBoundingClientRect().height > 0
      ? navMenu.getBoundingClientRect()
      : header.getBoundingClientRect();
    var x = rect.left + rect.width * 0.5;
    var y = rect.top + Math.min(Math.max(rect.height * 0.55, 20), rect.bottom - 2);
    /*
     * Bounding-box check — elementsFromPoint + closest() missed service banners because hit targets
     * can be wrapper divs (#smooth-content, etc.) whose ancestors are not the banner section.
     */
    var roots;
    try {
      roots = document.querySelectorAll(UR_NAV_DARK_BG_SELECTOR);
    } catch (e) {
      return false;
    }
    for (var i = 0; i < roots.length; i++) {
      var br = roots[i].getBoundingClientRect();
      if (br.width < 2 || br.height < 2) continue;
      if (x >= br.left && x <= br.right && y >= br.top && y <= br.bottom) return true;
    }
    return false;
  }

  function urUpdateHeaderDarkOverlap() {
    var header = document.querySelector('.header');
    if (!header || window.innerWidth < 992) {
      if (header) header.classList.remove('header--over-dark');
      return;
    }
    if (header.classList.contains('fixed-header')) {
      header.classList.remove('header--over-dark');
      return;
    }
    if (urHeaderOverlapsDarkBackdrop()) header.classList.add('header--over-dark');
    else header.classList.remove('header--over-dark');
  }

  var urUpdateHeaderSticky = urThrottleRaf(function () {
    /* Activate pill bar sooner so links rarely sit on dark mesh without the scrolled chrome */
    if ($(window).scrollTop() >= 130) {
      $('.header').addClass('fixed-header');
    } else {
      $('.header').removeClass('fixed-header');
    }
    urUpdateHeaderDarkOverlap();
  });
  // // ========================= Header Sticky Js End===================

  // //============================ Scroll To Top Icon Js Start =========
  var btn = $('.scroll-top');

  var urUpdateScrollTopBtn = urThrottleRaf(function () {
    if ($(window).scrollTop() > 130) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });

  btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, '300');
  });

  // ========================== Header Hide Scroll Bar Js Start =====================
  $('.navbar-toggler.header-button').on('click', function () {
    $('body').toggleClass('scroll-hide-sm');
  });
  $('.body-overlay').on('click', function () {
    $('body').removeClass('scroll-hide-sm');
  });
  // ========================== Header Hide Scroll Bar Js End =====================

  // ========================== Small Device Header Menu On Click Dropdown menu collapse Stop Js Start =====================
  $('.dropdown-item').on('click', function () {
    $(this).closest('.dropdown-menu').addClass('d-block');
  });
  // ========================== Small Device Header Menu On Click Dropdown menu collapse Stop Js End =====================

  // ========================== Add Attribute For Bg Image Js Start =====================
  $('.bg-img').css('background-image', function () {
    var bg = 'url(' + $(this).data('background-image') + ')';
    return bg;
  });
  // ========================== Add Attribute For Bg Image Js End =====================


  // ========================= Text Circle Js Start ===================
  document.querySelectorAll('.footer__circle__text').forEach((circleText) => {
    const textElement = circleText.querySelector("p");
    if (textElement) {
      textElement.innerHTML = textElement.innerText
        .split("")
        .map((char, i) => `<span style="transform:rotate(${i * 7.8}deg)">${char}</span>`)
        .join("");
    }
  });
  // ========================= Text Circle Js End ===================


  // ========================= Nice Select Js Start ===================
  if ($('select').length) {
    $('select').niceSelect();
  }
  // ========================= Nice Select Js End ===================


  // ========================= Owl Carousel Js Start ===================
  if ($('.testimonial__wrap').length) $('.testimonial__wrap').owlCarousel({
    dots: true,
    loop: true,
    nav: false,
    navText: ['<i class="fas fa-long-arrow-alt-left"></i>', '<i class="fas fa-long-arrow-alt-right"></i>'],
    autoplay: true,
    smartSpeed: 650,
    autoplayTimeout: 5200,
    items: 3,
    margin: 22,
    slideToScroll: 1,
    center: true,
    autoplayHoverPause: true,
    stagePadding: 28,

    responsive: {
      0: {
        items: 1,
        stagePadding: 16,
        margin: 14,
      },
      320: {
        items: 1,
        stagePadding: 16,
        margin: 16,
      },
      450: {
        items: 1,
        stagePadding: 20,
        margin: 18,
      },
      575: {
        items: 2,
        stagePadding: 16,
        margin: 18,
      },
      768: {
        items: 2,
        stagePadding: 18,
        margin: 20,
      },
      992: {
        items: 2,
        stagePadding: 22,
        margin: 22,
      },
      1100: {
        items: 2,
        stagePadding: 24,
        margin: 22,
      },
      1200: {
        items: 3,
        stagePadding: 24,
        margin: 22,
      },
      1360: {
        items: 3,
        stagePadding: 28,
        margin: 24,
      },
      1449: {
        items: 3,
        stagePadding: 28,
        margin: 24,
      },
      1500: {
        items: 3,
        stagePadding: 32,
        margin: 26,
      },
      1600: {
        items: 3,
        stagePadding: 36,
        margin: 28,
      },
      1700: {
        items: 3,
        stagePadding: 40,
        margin: 28,
      }
    }
  });
  // ========================= Owl Carousel Js End ===================


  // ========================= Owl Carousel Js Start ===================
  if ($('.payment__main__slider').length) $('.payment__main__slider').owlCarousel({
    dots: false,
    loop: true,
    nav: false,
    navText: ['<i class="fas fa-long-arrow-alt-left"></i>', '<i class="fas fa-long-arrow-alt-right"></i>'],
    autoplay: true,
    smartSpeed: 800,
    autoplayTimeout: 4500,
    items: 1,
    margin: 20,
    slideToScroll: 1,
    autoplayHoverPause: false,
  });
  // ========================= Owl Carousel Js End ===================


  // ========================= Owl Carousel Js Start ===================
  if ($('.service__brand__main').length) $('.service__brand__main').owlCarousel({
    dots: false,
    loop: true,
    nav: false,
    navText: ['<i class="fas fa-long-arrow-alt-left"></i>', '<i class="fas fa-long-arrow-alt-right"></i>'],
    autoplay: true,
    smartSpeed: 800,
    autoplayTimeout: 4000,
    items: 6,
    margin: 40,
    slideToScroll: 1,
    autoplayHoverPause: false,
    responsive: {
      0: {
        items: 1,
        center: true,
        margin: 20,
      },
      320: {
        items: 2,
        center: true,
        margin: 20,
      },
      450: {
        items: 3,
        center: true,
        margin: 20,
      },
      575: {
        items: 3,
      },
      768: {
        items: 4,
      },
      992: {
        items: 5,
      },
      1100: {
        items: 5,
      },
      1200: {
        items: 6,
      },
    }
  });
  // ========================= Owl Carousel Js End ===================


  // ========================= Counter Js Start ===================
  if ($('.counter').length) {
    $('.counter').counterUp({
      delay: 10,
      time: 1000,
    });
  }
  // ========================= Counter Js End ===================


  // ================== Sidebar Menu Js Start ===============
  // Sidebar Dropdown Menu Start
  $(document).on('click', '.has-dropdown > a', function () {
    $('.sidebar-submenu').slideUp(200);
    if ($(this).parent().hasClass('active')) {
      $('.has-dropdown').removeClass('active');
      $(this).parent().removeClass('active');
    } else {
      $('.has-dropdown').removeClass('active');
      $(this).next('.sidebar-submenu').slideDown(200);
      $(this).parent().addClass('active');
    }
  });
  // Sidebar Dropdown Menu End
  // Sidebar Icon & Overlay js
  $('.navigation-bar').on('click', function () {
    $('.sidebar-menu').addClass('show-sidebar');
    $('.sidebar-overlay').addClass('show');
  });
  $('.sidebar-menu__close, .sidebar-overlay').on('click', function () {
    $('.sidebar-menu').removeClass('show-sidebar');
    $('.sidebar-overlay').removeClass('show');
  });
  // Sidebar Icon & Overlay js
  // ===================== Sidebar Menu Js End =================


  // ========================= Service hover add class Js Start =====================
  $(".service__main__single").on("mouseenter", function () {
    $(".service__main__single").removeClass("active");
    $(this).addClass("active");
  });

  $(".service__main__single").on("mouseleave", function () {
    $(".service__main__single").removeClass("active"); // Remove class from all elements
    $(this).addClass("active"); // Add class only to the last hovered element
  });
  // ========================= Service hover add class Js End =====================


  // ========================= FAQ Js Start =====================
  if ($('.accordion').length) {
    const ACCORDION_SELECTOR = '.accordion'; // Accordion container selector
    const ACTIVE_CLASS = 'active'; // Class to toggle on accordion item

    initializeAccordionToggler();

    function initializeAccordionToggler() {
      $(ACCORDION_SELECTOR).on('show.bs.collapse hide.bs.collapse', function (event) {
        const $accordionItem = $(event.target).closest('.accordion-item');

        // Toggle 'active' class based on event type
        $accordionItem.toggleClass(ACTIVE_CLASS, event.type === 'show');
      });
    }
  }
  // ========================= FAQ Js End =====================


  // ========================= AOS Js Start =====================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      easing: 'ease-out-cubic',
      duration: 520,
      once: true,
      mirror: false,
      offset: 32,
      disableMutationObserver: true,
      throttleDelay: 120,
      debounceDelay: 80,
      disable: function () {
        if (urPrefersReducedMotion()) return true;
        return window.innerWidth < 768;
      },
    });
  }
  // ========================= AOS Js End =====================

  // ========================= Nested Dropdown Js Start =====================
  // Keep Products (and other nav) dropdown open when moving to Custom Checkout, Hyper Checkout, Orchestration
  $('.navbar .nav-item.dropdown .dropdown-toggle').attr('data-bs-auto-close', 'outside');

  // --- Desktop: hover-based open/close so menu NEVER closes while moving cursor to menu items ---
  var navDropdownCloseTimer = null;
  function closeAllNavDropdowns() {
    $('.navbar .nav-item.dropdown .dropdown-toggle').each(function() {
      var dd = typeof bootstrap !== 'undefined' && bootstrap.Dropdown && bootstrap.Dropdown.getInstance(this);
      if (dd) dd.hide();
    });
  }
  function showNavDropdown($navItem) {
    var $toggle = $navItem.find('.dropdown-toggle').eq(0);
    if ($toggle.length) {
      var dd = typeof bootstrap !== 'undefined' && bootstrap.Dropdown && bootstrap.Dropdown.getOrCreateInstance($toggle[0]);
      if (dd) dd.show();
    }
  }
  function closeOtherNavDropdowns($exceptNavItem) {
    closingFromOutsideClick = true;
    $('.navbar .nav-item.dropdown').each(function() {
      if ($(this).is($exceptNavItem)) return;
      var $t = $(this).find('.dropdown-toggle').eq(0);
      var dd = typeof bootstrap !== 'undefined' && bootstrap.Dropdown && bootstrap.Dropdown.getInstance($t[0]);
      if (dd) dd.hide();
    });
    setTimeout(function() { closingFromOutsideClick = false; }, 0);
  }
  $(document).on('mouseenter', '.navbar .nav-item.dropdown', function() {
    if (window.innerWidth <= 991) return;
    clearTimeout(navDropdownCloseTimer);
    navDropdownCloseTimer = null;
    var $nav = $(this);
    closeOtherNavDropdowns($nav);
    showNavDropdown($nav);
  });
  $(document).on('mouseleave', '.navbar .nav-item.dropdown', function() {
    if (window.innerWidth <= 991) return;
    var $nav = $(this);
    navDropdownCloseTimer = setTimeout(function() {
    if (!$nav.find('.dropdown-toggle').is(':hover') && !$nav.find('.dropdown-menu').is(':hover')) {
      var $t = $nav.find('.dropdown-toggle').eq(0);
      var dd = typeof bootstrap !== 'undefined' && bootstrap.Dropdown && bootstrap.Dropdown.getInstance($t[0]);
      if (dd) dd.hide();
    }
    navDropdownCloseTimer = null;
    }, 200);
  });
  $(document).on('mouseenter', '.navbar .nav-item.dropdown .dropdown-menu', function() {
    if (window.innerWidth <= 991) return;
    clearTimeout(navDropdownCloseTimer);
    navDropdownCloseTimer = null;
  });
  $(document).on('mouseleave', '.navbar .nav-item.dropdown .dropdown-menu', function() {
    if (window.innerWidth <= 991) return;
    var $menu = $(this);
    var $nav = $menu.closest('.nav-item.dropdown');
    navDropdownCloseTimer = setTimeout(function() {
      var $t = $nav.find('.dropdown-toggle').eq(0);
      var dd = typeof bootstrap !== 'undefined' && bootstrap.Dropdown && bootstrap.Dropdown.getInstance($t[0]);
      if (dd) dd.hide();
      navDropdownCloseTimer = null;
    }, 200);
  });

  // Block Bootstrap from closing dropdown when we're just moving the cursor (only allow our close)
  var closingFromOutsideClick = false;
  $(document).on('hide.bs.dropdown', function(e) {
    if (window.innerWidth <= 991) return;
    if (closingFromOutsideClick) return;
    if (!$(e.target).closest('.navbar .nav-item.dropdown').length) return;
    e.preventDefault();
  });

  // Close only when user clicks outside (or on toggle again)
  $(document).on('click', function(e) {
    if (window.innerWidth <= 991) return;
    var $clicked = $(e.target).closest('.navbar .nav-item.dropdown');
    if ($clicked.length) {
      if ($(e.target).closest('.dropdown-menu').length) return;
      var $toggle = $(e.target).closest('.dropdown-toggle');
      if ($toggle.length && $toggle[0].getAttribute('aria-expanded') === 'true') {
        closingFromOutsideClick = true;
        var dd = typeof bootstrap !== 'undefined' && bootstrap.Dropdown && bootstrap.Dropdown.getInstance($toggle[0]);
        if (dd) dd.hide();
        setTimeout(function() { closingFromOutsideClick = false; }, 0);
      }
      return;
    }
    closingFromOutsideClick = true;
    closeAllNavDropdowns();
    setTimeout(function() { closingFromOutsideClick = false; }, 0);
  });

  // Prevent close on scroll when cursor is in menu
  var scrollJustHappened = false;
  var scrollGuardTimer;
  function urOnNavScrollGuard() {
    if (window.innerWidth <= 991) return;
    scrollJustHappened = true;
    clearTimeout(scrollGuardTimer);
    scrollGuardTimer = setTimeout(function () {
      scrollJustHappened = false;
    }, 200);
  }

  /** One passive window scroll listener (fewer main-thread listeners than multiple jQuery scroll binds). */
  function urOnWindowScrollCombined() {
    urUpdateHeaderSticky();
    urUpdateScrollTopBtn();
    urOnNavScrollGuard();
  }
  window.addEventListener('scroll', urOnWindowScrollCombined, { passive: true });
  window.addEventListener(
    'resize',
    urThrottleRaf(function () {
      urUpdateHeaderDarkOverlap();
    }),
    { passive: true }
  );

  urUpdateHeaderSticky();
  urUpdateScrollTopBtn();
  $(document).on('hide.bs.dropdown', '.navbar .nav-item.dropdown', function(e) {
    if (window.innerWidth <= 991) return;
    if (scrollJustHappened) e.preventDefault();
  });

  // Handle nested dropdown menus - allow navigation and submenu expansion
  // Don't prevent navigation - allow links to work normally
  $(document).on('click', '.dropdown-submenu > .dropdown-toggle', function(e) {
    // Allow navigation to proceed - don't prevent default
    // The submenu will show on hover, but clicking should navigate to the page
    // Only prevent if we're specifically trying to toggle (which we're not)
  });

  // Ensure all dropdown links work
  $(document).on('click', '.dropdown-menu .dropdown-item', function(e) {
    // Allow navigation - don't prevent default unless it's a toggle
    if (!$(this).hasClass('dropdown-toggle') || $(this).parent().hasClass('dropdown-submenu')) {
      // Allow normal navigation
      var href = $(this).attr('href');
      if (href && href !== '#' && href !== 'javascript:void(0)') {
        // Navigation will proceed normally
      }
    }
  });

  // Handle hover for desktop - show submenu on hover (Intent UPI → Static, Dynamic, P2P)
  $(document).on('mouseenter', '.dropdown-submenu', function() {
    if (window.innerWidth > 991) {
      var $sub = $(this);
      var $menu = $sub.find('> .dropdown-menu').first();
      $sub.addClass('show');
      $menu.addClass('show').css({ display: 'block', visibility: 'visible', opacity: '1' });
    }
  });

  $(document).on('mouseleave', '.dropdown-submenu', function() {
    if (window.innerWidth > 991) {
      var $this = $(this);
      var $menu = $this.find('> .dropdown-menu').first();
      setTimeout(function() {
        if (!$this.find('> .dropdown-item').is(':hover') && !$menu.is(':hover')) {
          $menu.removeClass('show').css({ display: '', visibility: '', opacity: '' }).hide();
          $this.removeClass('show');
        }
      }, 150);
    }
  });

  // Keep submenu visible when hovering over the submenu panel (the three links)
  $(document).on('mouseenter', '.dropdown-submenu > .dropdown-menu', function() {
    if (window.innerWidth > 991) {
      var $menu = $(this);
      var $sub = $menu.closest('.dropdown-submenu');
      $sub.addClass('show');
      $menu.addClass('show').css({ display: 'block', visibility: 'visible', opacity: '1' }).show();
    }
  });

  // Handle 3rd level nested dropdowns
  $(document).on('mouseenter', '.dropdown-menu .dropdown-submenu', function() {
    if (window.innerWidth > 991) {
      var $menu = $(this).find('.dropdown-menu');
      $(this).addClass('show');
      $menu.show();
    }
  });

  $(document).on('mouseleave', '.dropdown-menu .dropdown-submenu', function() {
    if (window.innerWidth > 991) {
      var $this = $(this);
      setTimeout(function() {
        if (!$this.is(':hover') && !$this.find('.dropdown-menu').is(':hover')) {
          $this.find('.dropdown-menu').hide();
          $this.removeClass('show');
        }
      }, 50);
    }
  });

  // Ensure submenu items are clickable and navigate properly
  $(document).on('click', '.dropdown-submenu .dropdown-menu .dropdown-item', function(e) {
    // Allow navigation to proceed normally - don't prevent default
    e.stopPropagation(); // Prevent closing parent dropdown but allow navigation
  });

  // Close nested dropdowns when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.dropdown-submenu').length && 
        !$(e.target).closest('.dropdown-menu').length &&
        !$(e.target).closest('.nav-item.dropdown').length) {
      $('.dropdown-submenu').removeClass('show');
      $('.dropdown-submenu .dropdown-menu').hide();
    }
  });
  // ========================= Nested Dropdown Js End =====================

  // ========================= GSAP Js Start =====================

  var _urScrollGsapSelectors =
    '.hero__wrap__title,.hero__thumb,.hero__thumb__sr1,.hero__thumb__sr2,.counter__main__single';
  if (!urPrefersReducedMotion() && $(_urScrollGsapSelectors).length) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    try {
      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.config) {
        ScrollTrigger.config({
          limitCallbacks: true,
          ignoreMobileResize: true,
        });
      }
    } catch (e) {}

  if (window.matchMedia("(max-width: 767px)").matches) {

  } else {
    // Hero section
    if ($('.hero__wrap__title').length) {
      gsap.to(".hero__wrap__title", {
        scale: .6, // Target zoom level
        scrollTrigger: {
          trigger: ".hero__thumb",
          start: "top bottom", // Start the animation when the top of the container reaches the center of the viewport
          end: "bottom center", // End the animation when the bottom of the container reaches the top of the viewport
          scrub: true, // Smooth scrubbing
        }
      });
    }

    if ($('.hero__thumb').length) {
      gsap.to(".hero__thumb", {
        scale: 1.1, // Target zoom level
        rotateX: 0,
        scrollTrigger: {
          trigger: ".hero__thumb",
          start: "top bottom", // Start the animation when the top of the container reaches the center of the viewport
          end: "bottom center", // End the animation when the bottom of the container reaches the top of the viewport
          scrub: true, // Smooth scrubbing
        }
      });
    }

    if ($('.hero__thumb__sr1').length) {
      gsap.to(".hero__thumb__sr1", {
        top: -30,
        scrollTrigger: {
          trigger: ".hero__thumb",
          start: "top bottom", // Start the animation when the top of the container reaches the center of the viewport
          end: "bottom top", // End the animation when the bottom of the container reaches the top of the viewport
          scrub: true, // Smooth scrubbing
        }
      });
    }

    if ($('.hero__thumb__sr2').length) {
      gsap.to(".hero__thumb__sr2", {
        top: -60,
        scrollTrigger: {
          trigger: ".hero__thumb",
          start: "top bottom", // Start the animation when the top of the container reaches the center of the viewport
          end: "bottom top", // End the animation when the bottom of the container reaches the top of the viewport
          scrub: true, // Smooth scrubbing
        }
      });
    }
  }

  /* App section: removed GSAP ScrollTrigger pin stack (5 concurrent pins caused severe scroll jank).
     Layout stays in normal document flow; see urbanrupee-design-system.css for any spacing tweaks. */

  // Counter Section
  if ($('.counter__main__single').length) {
    gsap.to(".counter__main__single", {
      rotate: 0,
      scrollTrigger: {
        trigger: ".counter__main__single",
        start: "top center", // Start the animation when the top of the container reaches the center of the viewport
        end: "bottom bottom", // End the animation when the bottom of the container reaches the top of the viewport
        scrub: true, // Smooth scrubbing
      }
    });
  }


  /* Blog / service sidebars: pin removed — use CSS position:sticky in urbanrupee-design-system.css */

  // Service Accordion (GSAP pin removed for scroll performance)

  }

  // ========================= GSAP Js End =====================


  // ========================= Cursor Js Start =====================
  if (
    $('.cursor').length &&
    !urPrefersReducedMotion() &&
    window.matchMedia &&
    window.matchMedia('(pointer: fine)').matches
  ) {
    gsap.set(".cursor", {
      xPercent: -50,
      yPercent: -50
    });

    var xTo = gsap.quickTo(".cursor", "x", {
        duration: 0.3,
        ease: "power3"
      }),
      yTo = gsap.quickTo(".cursor", "y", {
        duration: 0.3,
        ease: "power3"
      });

    var urCursorX = 0;
    var urCursorY = 0;
    var urCursorScheduled = false;
    window.addEventListener(
      'mousemove',
      function (e) {
        urCursorX = e.clientX;
        urCursorY = e.clientY;
        if (urCursorScheduled) return;
        urCursorScheduled = true;
        requestAnimationFrame(function () {
          urCursorScheduled = false;
          xTo(urCursorX);
          yTo(urCursorY);
        });
      },
      { passive: true }
    );
  }
  // ========================= Cursor Js End =====================


  // ========================= Preloader Js Start =====================
  if ($('.preloader').length) {
    $('body').addClass('loading-s');
    $(window).on('load', function () {
      $('.preloader').fadeOut();
      $('body').removeClass('loading-s');
    });
  }
  // ========================= Preloader Js End=====================
})(jQuery);






