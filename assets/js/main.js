var functions = {
  init: function(){
    $(document).foundation();
    this.webfonts();
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
  }

};

$(document).ready(function(){
  functions.init();
});


$(window).load(function(){
  functions.windowLoad();
});
