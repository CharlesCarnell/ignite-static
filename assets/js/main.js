var functions = {
  init: function(){
    $(document).foundation();
    this.webfonts();
    this.info.init();
  },

  windowLoad: function(){
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

  analytics: function(){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    // ga('create', 'UA-63676146-1', 'auto');
    // ga('send', 'pageview');
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
  },

  info: {
    init: function(){
      if( $('[data-info-text]').length ){
        this.info();
      }
    },
    info: function(){
      this.createTooltipDiv();
      this.attachEvents();
    },
    createTooltipDiv: function(){
      $('body').append('<div id="infoTooltip"><div class="inner"></div></div>');
    },
    attachEvents: function(){
      for (var i = 0; i < $('[data-info-text]').length; i++) {
        $( $('[data-info-text]')[i] ).on('mouseenter', this.onMouseEnter.bind(this));
        $( $('[data-info-text]')[i] ).on('mouseleave', this.onMouseLeave.bind(this));
        $( $('[data-info-text]')[i] ).on('click', this.onClick.bind(this));
      }
    },
    onMouseEnter: function(e){
      var element = $( $(e.currentTarget)[0] );
      var elementCoords = this.getElementCoords(element[0]);
      var x = elementCoords.left + (( $(element).parent().width() / 3) * 2);
      var y = elementCoords.top  - (( $(element).parent().height() / 3) * 2);
      this.positionTooltip(x, y);
      this.populateTooltip( $(element).data('info-text')  );
      this.removeClickClass();
      this.showTooltip();
      this.resetTimer();
    },
    onMouseLeave: function(e){
      var element = $( $(e.currentTarget)[0] );
      if( !$('#infoTooltip').hasClass('clicked') ){
        this.startTimer();
      }
    },
    onClick: function(e){
      if( $('#infoTooltip').hasClass('show') ){
        this.hideTooltip();
        this.removeClickClass();
      } else {
        var element = $( $(e.currentTarget)[0] );
        var elementCoords = this.getElementCoords(element[0])
        var x = elementCoords.left + (( $(element).parent().width() / 3) * 2);
        var y = elementCoords.top  - (( $(element).parent().height() / 3) * 2);
        this.positionTooltip(x, y);
        this.populateTooltip( $(element).data('info-text')  );
        this.addClickClass();
        this.showTooltip();
      }
    },
    positionTooltip: function(x, y){
      $('#infoTooltip')
        .css('top', y)
        .css('left', x);
    },
    showTooltip: function(){
      $('#infoTooltip').removeClass('hide');
      $('#infoTooltip').addClass('show');
    },
    hideTooltip: function(){
      $('#infoTooltip').removeClass('show');
      $('#infoTooltip').addClass('hide');
    },
    populateTooltip: function(value){
      $('#infoTooltip .inner').html(value);
    },
    startTimer: function(){
      var hideTooltip = this.hideTooltip.bind(this);
      this.interval = setInterval(function(){
        hideTooltip();
      }, 300);
    },
    resetTimer: function(){
      clearInterval(this.interval);
    },
    addClickClass: function(){
      $('#infoTooltip').addClass('clicked');
    },
    removeClickClass: function(){
      $('#infoTooltip').removeClass('clicked');
    },
    getElementCoords: function(elem){
      var box = elem.getBoundingClientRect();
      var body = document.body;
      var docEl = document.documentElement;
      var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
      var clientTop = docEl.clientTop || body.clientTop || 0;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;
      var top  = box.top +  scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return { top: Math.round(top), left: Math.round(left) };
    }
  }

};

$(document).ready(function(){
  functions.init();
});


$(window).load(function(){
  functions.windowLoad();
});
