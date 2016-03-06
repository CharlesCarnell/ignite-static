var functions = {
  init: function(){
    $(document).foundation();
    this.webfonts();
    this.info.init();
    this.toggleSidebar.init();
  },

  windowLoad: function(){
    this.responsiveTable.load();
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
  },

  toggleSidebar: {
    init: function(){
      if( $('#sidebar .inner .menu .hide-toggle').length ){
        this.toggleSidebar();
      }
    },
    toggleSidebar: function(){
      this.attachEvents();
    },
    attachEvents: function(){
      $('#sidebar .inner .menu .hide-toggle').on('click', this.click.bind(this));
    },
    click: function(e){
      var element = $( $(e.currentTarget)[0] );
      if( $('#sidebar').hasClass('expanded') ){
        this.close();
      } else {
        this.open();
      }
    },
    open: function(){
      $('#sidebar').addClass('expanded');
    },
    close: function(){
      $('#sidebar').removeClass('expanded');
    }
  },

  responsiveTable: {
    init: function(){
      if( $('table.responsive').length ){
        this.responsiveTable();
      }
    },
    load: function(){
      if( $('table.responsive').length ){
        this.responsiveTable();
        this.updateTables();
      }
    },
    responsiveTable: function(){
      this.switched = false;
      this.attachEvents();
    },
    attachEvents: function(){
      // $(window).on("redraw",function(){
        // this.updateTables();
      // });
      // $(window).on("resize", this.updateTables);
    },
    updateTables: function(){
      var splitTable = this.splitTable.bind(this);
      // if( ($(window).width() < 99999) && !this.switched ){
        // this.switched = true;
        $("table.responsive").each(function(i, element) {
          splitTable($(element));
        });
        // return true;
      // } else if( this.switched && ($(window).width() > 99999) ) {
        // this.switched = false;
        // $("table.responsive").each(function(i, element) {
          // unsplitTable($(element));
        // });
      // }
    },
    splitTable: function(original){
      original.wrap("<div class='table-wrapper' />");
      var copy = original.clone();
      copy.find("td:not(:nth-child(1)), th:not(:nth-child(1))").css("display", "none");
      copy.find("td:nth-child(2), th:nth-child(2)").css("display", "table-cell");
      copy.find("tbody td:nth-child(3), tbody th:nth-child(3)").css("display", "table-cell");
      copy.find('th:nth-child(2)').attr('colspan', 2);
      copy.removeClass("responsive");

      original.closest(".table-wrapper").append(copy);
      copy.wrap("<div class='pinned' />");
      original.wrap("<div class='scrollable' />");

      $('.table-wrapper .scrollable').css('margin-left', $('.pinned table').width());
      $('.pinned').css('width', $('.pinned table').width());
      this.setCellHeights(original, copy);
    },
    unsplitTable: function(original){
      original.closest(".table-wrapper").find(".pinned").remove();
      original.unwrap();
      original.unwrap();
    },
    setCellHeights: function(original, copy){
      var tr = original.find('tr');
      var tr_copy = copy.find('tr');
      var heights = [];

      tr.each(function(index){
        var self = $(this);
        var tx = self.find('th, td');

        tx.each(function(){
          var height = $(this).height();
          heights[index] = heights[index] || 0;
          if (height > heights[index]) heights[index] = height;
        });
      });

      tr_copy.each(function(index){
        $(this).height(heights[index]);
      });
    }
  }
};

$(document).ready(function(){
  functions.init();
});

$(window).load(function(){
  functions.windowLoad();
});
