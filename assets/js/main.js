var functions = {
  init: function(){
    $(document).foundation();
    this.initHideContent();
    this.equal();
    this.setHeroHeight();
    this.scrollbarEvent();
    this.initScrollToTargets();
    this.initStickyHeader();
    this.analytics();
    this.initAccordion();
    this.initMegamenu();
    this.megamenuKillTransition();
    this.initAutoComplete();
    this.mobileSearchActiveStates();
    this.hamburgerActiveStates();
    this.checkWindowWidth();
    this.mobileNavDropdownStates();
    this.navActiveStates();
    this.initFontAwesomeIE8();
  },

  windowLoad: function(){
    this.isotope();
  },

  webfonts: function(){
    WebFont.load({
      google: {
        families: ['Source Sans Pro']
      }
    });
  },

  equal: function(){
    function calculate(){
      $('[data-equal]').each( function( key, value ){
        // We need to reset the height of the elements we're adding dynamic heights to, for responsive behaviour
        $('[data-equal-target="' + $(value).attr('data-equal') +'"]').css('height', '' );
        $('[data-equal-target="' + $(value).attr('data-equal') +'"]').each( function( key2, value2 ){
          if( $(document).width() > 635 ){
            // We check if there's more than one element with the same data-equal
            if( $('[data-equal="' + $(value).attr('data-equal') + '"]').length > 1 ){
              // if so, we calculate the greatest height of all said elements
              var greatestHeight = 0;
              $('[data-equal="' + $(value).attr('data-equal') + '"]').each( function( key3, value3 ){
                if( $(value3).outerHeight() > greatestHeight ){
                  greatestHeight = $(value3).outerHeight();
                }
                if( key3 == ( $('[data-equal="' + $(value).attr('data-equal') +'"]').length - 1 )){
                  $(value2).css('height', greatestHeight);
                }
              });
            } else {
              $(value2).css('height', $(value).outerHeight() );
            }
          }
        });
      });
    }
    calculate();
    $(window).on('resize', Foundation.utils.throttle(function(e){
      calculate();
    }, 300));
  },

  initHideContent: function(){
    $('.callback-section-inner').addClass('hide');
    //CLOSES ALL DIVS ON PAGE LOAD
    $("div.accordion-content").hide();
    $("div.accordion-button").removeClass('accordion-button-active');
  },

  initAutoComplete: function(){
    $('.mobile-nav .search').on('click', function(){
      $('.search-form').toggleClass('active');
    });
    $('.search-close').on('click', function(e){
      e.preventDefault();
      $('.search-form').removeClass('active');
    });

    // $('#autocomplete-container, .searchbar-mobile').hover(function(){
    //   $('body').addClass('is-fixed');
    // },
    // function () {
    //   $('body').removeClass('is-fixed');
    // });

    $.ui.autocomplete.prototype._renderItem = function(ul, item){
      var term = this.term.split(' ').join('|');
      var re = new RegExp("(" + term + ")", "gi") ;
      var t = item.label.replace(re,"<span class=\"ui-state-highlight\">$1</span>");
      return $( "<li></li>" )
       .data( "item.autocomplete", item )
       .append( "<a>" + t + "</a>" )
       .appendTo( ul );
    };

    $("#queries_keyword_query").autocomplete({

      minLength: 4,
      appendTo: "#autocomplete-container",
      source: function(request, response) {
        $.getJSON("http://www.kent.gov.uk/_scs-beta/search-suggestions", { queries_suggestion_query: request.term, queries_exclude_query: "no" }, response);
      },
      open: function() {
        $("#autocomplete-container > ul").css({top: 5 + "px"});
        $("#autocomplete-container > ul").css({position: "static"});
      },
      search: function() {
        $(".search-loader").show();
      },
      change: function() {
        $(".search-loader").hide();
      },
      response: function() {
        $(".search-loader").hide();
      },
      select: function(e, ui) {
        e.preventDefault();
        window.location.href = ui.item.value;
      },
      focus: function(e, ui) {
        e.preventDefault();
      }
    });

    $("#queries_keyword_query_mobile").autocomplete({
      minLength: 4,
      appendTo: "#autocomplete-container-mobile",
      source: function(request, response) {
        $.getJSON("http://www.kent.gov.uk/_scs-beta/search-suggestions", { queries_suggestion_query: request.term, queries_exclude_query: "no" }, response);
      },
      open: function() {
        $("#autocomplete-container-mobile > ul").css({top: 5 + "px"});
        $("#autocomplete-container-mobile > ul").css({position: "static"});
      },
      search: function() {
        $(".search-loader").show();
      },
      change: function() {
        $(".search-loader").hide();
      },
      response: function() {
        $(".search-loader").hide();
      },
      select: function(e, ui) {
        e.preventDefault();
        window.location.href = ui.item.value;
      },
      focus: function(e, ui) {
        e.preventDefault();
      }
    });

    $(".search-form .search").blur(function() {
      $(".search-loader").hide();
    });
  },

  initStickyHeader: function(){

    var lastScrollTop = 0;
    $(window).on('scroll', Foundation.utils.throttle(function(e){
      if( !$('body').hasClass( "is-fixed" ) ){
        if( ( $(this).scrollTop() > lastScrollTop ) ){
          var triggerPoint = 0;
          if( window.location.pathname === '/templates/homepage.html' || window.location.pathname === '/_scs-beta' || window.location.pathname === '/' ){
            triggerPoint = $('header').outerHeight();
          } else {
            triggerPoint = $('.navigation-desktop').outerHeight() * 1.5;
          }
          // Scroll down
          if( $(window).scrollTop() >= triggerPoint ){
            $('body').addClass('headerTransformed');
            $('body').attr('data-nav', 'sticky');
          } else {
            $('body').removeClass('headerTransformed');
            $('body').attr('data-nav', 'static');
          }
        } else {

          // Scroll up
          $('header').removeClass('pulledUp');

          if( $(window).scrollTop() >= $('header').outerHeight() ){
            $('body').attr('data-nav', 'sticky');
            $('body').addClass('headerTransformed');
          } else if( $(window).scrollTop() <= $('header').outerHeight() ){
            $('body').removeClass('headerTransformed');
            $('body').attr('data-nav', 'static');
          }
        }
      }
      lastScrollTop = $(this).scrollTop();
    }, 1));
  },

  setHeroHeight: function(){

    var scalingDirection;

    // Cache a reference to $(window), for performance, and get the initial dimensions of the window
    var $window = $(window),
        previousDimensions = {
            width: $window.width(),
            height: $window.height()
        };

    function calculate(){

      var newDimensions = {
            width: $window.width(),
            height: $window.height()
        };

        if ( (newDimensions.width > previousDimensions.width) || (newDimensions.height > previousDimensions.height) ) {
            // scaling up
            scalingDirection = "up";
        } else {
            // scaling down
            scalingDirection = "down";
        }

        // Store the new dimensions
        previousDimensions = newDimensions;

      var windowWidth = $(window).width();
      var headerheightExpanded = 180;
      var headerheightSingleBar = 94;
      var heroHeight;

      if( windowWidth > 960 ){
        heroHeight = $(window).height() - headerheightExpanded - $('.scrollbar').outerHeight() + 5; //the extra 5 pixels adjusts to hide the top of the content boxes section
      }else{
        heroHeight = $(window).height() - headerheightSingleBar - $('.scrollbar').outerHeight() + 5; //the extra 5 pixels adjusts to hide the top of the content boxes section
      }
      var heroTopYpos = $('#hero').offset().top;
      var heroBottomYpos = heroTopYpos + heroHeight;
      var heroHeightPercentage = heroHeight * 0.2;

      var heroBoxHeight = $('#hero .box').outerHeight();
      var heroBoxTopYpos = $('#hero .box').offset().top;
      var heroBoxBottomYpos = heroBoxTopYpos + heroBoxHeight;
      var heroBoxVertPaddingTotal = parseInt($('#hero .box').css('padding-top')) + parseInt($('#hero .box').css('padding-bottom'));
      
      var heroAndBoxDiff = heroBottomYpos - heroBoxBottomYpos;

      var heroBoxInnerHeight = $('#hero .box .box-inner').outerHeight();
      var shrinkwrappedHeight = heroBoxInnerHeight + heroBoxVertPaddingTotal;

      if( windowWidth > 640 ){
        $('#hero').height( heroHeight );
        if( heroAndBoxDiff < 40 ){
          $('#hero .box').css('top', '0');
          $('#hero .box').css('height', '1000px');
          if( ( (shrinkwrappedHeight + heroHeightPercentage + 30) < heroHeight ) && (scalingDirection == "up") ){
            $('#hero .box').css('top', '20%');
            $('#hero .box').css('height', 'auto');
          }
        }
      }else{
        $('#hero').css('height', 'auto');
      }
    }
    if( $('#hero').length ){
      calculate();
      $(window).on('resize', Foundation.utils.throttle(function(e){
        calculate();
      }, 300));
    }
  },

  scrollbarEvent: function(){
    function scroll(){
      var navHeightOffset = 0;
      $('.navigation-mobile').is(":visible") ? navHeightOffset = 0 : navHeightOffset = $('.navigation-desktop').outerHeight() * -1;
      $('html, body').animate({ scrollTop: $('.scrollbar').position().top - navHeightOffset }, 600)
    }

    function toggleVisibility(){
      if( !$('.scrollbar').hasClass('hidden') ){
        $('.scrollbar').addClass('hidden');
      }     
    }
    if( $('.scrollbar').length ){
      $('.scrollbar').on('click', function(){
        toggleVisibility();
        scroll();
      });
    }

    $(window).on('scroll', Foundation.utils.throttle(function(e){
      if( $('.scrollbar').length ){
        if( $(window).scrollTop() > $('.scrollbar').position().top - ( ($(window).height() / 4) * 3 ) ){
          $('.scrollbar').addClass('hidden');
        } else if( $(window).scrollTop() <= $('.scrollbar').position().top - ( ($(window).height() / 4) * 3 ) ){
          $('.scrollbar').removeClass('hidden');
        }
      }
    }, 300));
  },

  isotope: function(){
    if( $('.featured-items-wrapper').length ){
      $('.featured-items-wrapper').isotope({ itemSelector: '.featured-item' })
    }
  },

  analytics: function(){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-63676146-1', 'auto');
    ga('send', 'pageview');
  },

  desktopSearchToggle: {
    toggle: '#search',
    toggleButtons: 'header .utilities .search, #search .toggle-div',
    init: function(){
      this.events();
    },
    events: function(){
      var that = this;
      $( that.toggleButtons ).on('click', function(){
        if( !$( that.toggle ).data('open') ){
          that.open();
        } else {
          that.close();
        }
      });
    },
    open: function(){
      $( this.toggle + ', .search, #utility-bar .inner' ).toggleClass('enabled');
    },
    close: function(){
      $( this.toggle + ', .search, #utility-bar .inner' ).toggleClass('enabled');
    }
  },

  initScrollToTargets: function(){
    
    var items = [
      {
        target: '.ping-down-btn-1',
        destination: '.ping-down-sect-1',
        duration: 700
      },
      {
        target: '.ping-down-btn-2',
        destination: '.ping-down-sect-2',
        duration: 700
      }
    ];


    for( var i = 0; i < items.length; i++ ){

      this.initScrollToTarget(items[i]);
    }
  },

  initScrollToTarget: function(item){
    $( item.target ).click(function(){
      $( item.destination ).velocity('scroll', {
        easing: 'easeOutSine',
        duration: item.duration
      });
    });

  },

  initSocialWindows: function(){
    $('.social .icons a').on('click', function(e){
      e.preventDefault();
      var px = Math.floor(((screen.availWidth || 1024) - 500) / 2);
      var py = Math.floor(((screen.availHeight || 700) - 500) / 2);
      var params = 'width=500,height=500,left=' + px + ',top=' + py + 'location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1';
      var popup = window.open( $(this).attr('href'), 'social', params );
      if( popup ){
        popup.focus();
      }
    });
  },

  initCarousel: function(){
    var slider = $('.carousel').owlCarousel({
      items: 1,
      center: true,
      nav: false,
      dots: false,
      loop: true,
      URLhashListener: true,
      startPosition: 'URLHash'
    });
    $('.carousel-wrapper .arrows .left').on('click', function(){
      slider.trigger('prev.owl.carousel');
    });
    $('.carousel-wrapper .arrows .right').on('click', function(){
      slider.trigger('next.owl.carousel');
    });
  },

  initMegamenu: function() {
    $(".navigation-desktop .menu-wrapper").accessibleMegaMenu({
      uuidPrefix: "accessible-megamenu",
      menuClass: "items",
      topNavItemClass: "mega",
      panelClass: "dropdown-menu",
      panelGroupClass: "menu",
      hoverClass: "hover",
      focusClass: "focus",
      openClass: "open"
    });
    $('.menu-wrapper .items .default').children('.dropdown-menu').removeClass('dropdown-menu');
  },

  megamenuKillTransition: function(){
    $('.navigation-desktop li').bind('mouseover',function(){
      if( $('.dropdown-menu').hasClass('open') ){
        $('.mega').addClass('no-transition');
      }
    });

    $('.navigation-desktop li').bind('mouseout',function(){
        $('.mega').removeClass('no-transition');
    });
  },

  initAccordion: function(){
    /********************************************************************************************************************
    ACCORDIAN STYLE MENU FUNCTION
    ********************************************************************************************************************/
    $('div.accordion-button, div.accordion-cntt-btn').click(function() {
      var contHeight = $('.accordion-content-active').outerHeight();
      var relatedContent = $(this).next();
      var newAccButtonYpos = $(this).offset().top;
      var oldAccButtonYpos = "";

      if( $('div.accordion-button').hasClass('accordion-button-active') ) {
        oldAccButtonYpos = $('.accordion-content-active').offset().top;
      } else {
        oldAccButtonYpos = 1;
      }
      $('div.accordion-content').slideUp('normal');
      $('div.accordion-button').removeClass('accordion-button-active');
      $('div.accordion-button').addClass('accordion-button-inactive');
      $('div.accordion-content').removeClass('accordion-content-active');

      $('div.accordion-button').find('.awards_our_sponsors').children('.plus_minus_btn').css('background-position', '0 -26px');

      if( relatedContent.is(':visible') ) { // If the tab is already open
        relatedContent.slideUp('normal');
        $(this).find('.awards_our_sponsors').children('.plus_minus_btn').css('background-position', '0 -26px');
        $("div.accordion-button").removeClass('accordion-button-active');
        $('div.accordion-button').addClass('accordion-button-inactive');
        $('div.accordion-content').removeClass('accordion-content-active');
      } else {
        relatedContent.slideDown('normal');
        $(this).find('.awards_our_sponsors').children('.plus_minus_btn').css('background-position', '0 -26px');

        if( $(this).hasClass('accordion-button') ) {
          $(this).addClass('accordion-button-active');
        }
        $(this).removeClass('accordion-button-inactive');
        relatedContent.addClass('accordion-content-active');

        if( newAccButtonYpos > oldAccButtonYpos ) {
          $('html,body').animate({
            scrollTop: (($(this).offset().top) - contHeight - $('header').outerHeight() - 6)
          }, 500);
          return false;
        } else {
          $('html,body').animate({
            scrollTop: $(this).offset().top - $('header').outerHeight() - 6
          }, 500);
          return false;
        }
      }
    });
  },

  navActiveStates: function(){
    desktop();
    mobile();
    function desktop(){
      $('ul.items li a').each(function(key, value){
          var valueAnchor = $(value);
          var parentAnchor = valueAnchor.parents('.mega').find('a');
          if( valueAnchor.attr('href') === window.location.href ){
              valueAnchor.addClass('selected');
              $(parentAnchor[0]).addClass('selected');
          } else {
          }
      });
      $('#sidebar .navigation ul.first li').each( function(key, value){
        if( $(value).find('ul.second li').length ){
          $(value).addClass('hasChildren');
        }
      });
    }
    function mobile(){
      $('#dropdown-btn-1').removeClass('selected');
      $('#dropdown-btn-2').removeClass('selected');
      $('#dropdown-btn-3').removeClass('selected');
      $('#dropdown-btn-4').removeClass('selected');

      $('.navigation-mobile .menu-wrapper .dropdown-menu').removeClass('dropdown-active');

      var valueAnchor = $('.navigation-mobile .menu-wrapper .dropdown-menu .navigation ul.first li.selected');
      var parentAnchor = valueAnchor.parents('.dropdown-menu');
      $(parentAnchor).addClass('dropdown-active');
      $(parentAnchor).siblings('a').addClass('selected');

      if( !$('.navigation-mobile .menu-wrapper .dropdown-menu .navigation ul.first li.selected').length ){
        var firstMenu = $('.navigation-mobile .menu-wrapper .dropdown-menu')[0];
        $(firstMenu).addClass('dropdown-active');
        $('#dropdown-btn-1').addClass('selected');
      }

      $('.navigation-mobile .menu-wrapper .dropdown-menu .navigation ul.first li').each( function(key, value){
        if( $(value).find('ul.second li').length ){
          $(value).addClass('hasChildren');
        }
      });
    }
  },

  mobileSearchActiveStates: function(){
    $('.navigation-mobile .items-top-level .search').on('click', function(e){
      e.preventDefault();
      $('.searchbar-mobile').addClass('is-active');
      setTimeout( function(){
        $('#queries_keyword_query_mobile').focus();
      }, 50 );
    });
    $('.cross-btn-box').on('click', function(){
      $('.searchbar-mobile').removeClass('is-active');
    });
  },

  hamburgerActiveStates: function(){
    var current;
    $('.c-hamburger').on('click', function(){
      if( !$(this).hasClass('is-active') ){
        $(this).addClass('is-active');
        $('header > .inner').addClass('is-faded');
        //$('body').addClass('is-fixed');
        $('.menu-wrapper').addClass('open');
        $('.footer-cover').addClass('footer-cover-show');
      } else {
        $(this).removeClass('is-active');
        $('header > .inner').removeClass('is-faded');
        //$('body').removeClass('is-fixed');
        $('.menu-wrapper').removeClass('open');
        $('.footer-cover').removeClass('footer-cover-show');
      }
    });
    $('header > .inner, .footer-cover').on('click', function(e){
      if(e.target === this){
        $('.c-hamburger').removeClass('is-active');
        $('header > .inner').removeClass('is-faded');
        //$('body').removeClass('is-fixed');
        $('.menu-wrapper').removeClass('open');
        $('.footer-cover').removeClass('footer-cover-show');
      }
    });
  },

  checkWindowWidth: function(){
    function checkWidth(){

      var uiAutocompleteheight = $(window).height() - $('#autocomplete-container-mobile').offset().top - 200;     
      $('.searchbar-mobile .ui-autocomplete').css('max-height', '4000px');
      $('.searchbar-mobile .ui-autocomplete').css({height: uiAutocompleteheight + "px"});

      if( $(window).width() > 960 ){
        $('body').removeClass('is-fixed');
      }else{
      }
    }
    checkWidth();
    $(window).on('resize', Foundation.utils.throttle(function(e){
      checkWidth();
    }, 300));
  },

  mobileNavDropdownStates: function(){
      var timer;

      $('#dropdown-btn-2').on('click', function(e){
        e.preventDefault();
        $(this).addClass('selected');
        $(this).parent().siblings().children().removeClass('selected');
        clearTimeout(timer); 
        $('#dropdown-2')
          .removeClass('dropdown-inactive, dropdown-inactive-alt')
          .removeClass('dropdown-inactive-alt');

        $('#dropdown-1').addClass('dropdown-inactive');
        $('#dropdown-2').addClass('dropdown-active');

        timer = setTimeout(function(e) {
          $('#dropdown-1')
            .removeClass('dropdown-active')
            .removeClass('dropdown-inactive');
        }, 500);
      });

      $('#dropdown-btn-1').on('click', function(e){
        e.preventDefault();
        $(this).addClass('selected');
        $(this).parent().siblings().children().removeClass('selected');
        clearTimeout(timer);
        $('#dropdown-1')
          .removeClass('dropdown-inactive')
          .removeClass('dropdown-inactive-alt');

        $('#dropdown-1').addClass('dropdown-active');
        $('#dropdown-2').addClass('dropdown-inactive');

        timer = setTimeout(function(e) {   
          $('#dropdown-2')
            .removeClass('dropdown-active')
            .removeClass('dropdown-inactive');
        }, 500);
      });

      $('#dropdown-btn-3, #dropdown-btn-4').on('click', function(){
        $(this).addClass('selected');
        $(this).parent().siblings().children().removeClass('selected');  
        clearTimeout(timer);
        $('#dropdown-1, #dropdown-2')
          .removeClass('dropdown-active')
          .addClass('dropdown-inactive-alt');

        timer = setTimeout(function(e) {
          $('#dropdown-1, #dropdown-2').removeClass('dropdown-inactive-alt');
        }, 500);
      });
  },

  initFontAwesomeIE8: function(){
    if( $('body').hasClass('lt-ie9') ){
      var head = document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';
      style.styleSheet.cssText = ':before,:after{content:none !important';
      head.appendChild(style);
      setTimeout(function(){
        head.removeChild(style);
      }, 0);
    }
  }

};

$(document).ready(function(){
  functions.init();
});


$(window).load(function(){
  functions.windowLoad();
});
