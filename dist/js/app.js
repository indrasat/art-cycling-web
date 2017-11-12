(function($){

  'use strict'

  var doc = $(document),
      win = $(window),
      html = $('html'),
      istouch = "undefined" !== IS_TOUCH_DEVICE && IS_TOUCH_DEVICE ? true : false;

  /* Click */
  (function(){

    doc.on('click', '.has-loading', function(e){

      // replace e.preventDefault(); with proper methods based on your site functionalities
      // classes:
      //  processing - displays loading icon
      e.preventDefault();

      var self = $(this);

      if ( false === self.hasClass('processing') ){

        if ( 0 === self.find('.preloader').length ){
          self.append(
            [
              '<span class="preloader">',
                '<svg viewBox="25 25 50 50">',
                  '<circle cx="50" cy="50" r="20"></circle>',
                '</svg>',
              '</span>'
            ].join('')
          )
        }

        self.addClass('processing');

        setTimeout(function(){
          self.removeClass('processing');
        }, 3000);
      }
    });

    doc.on('click', '.icon-link', function(e){

      // replace e.preventDefault(); with proper methods based on your site functionalities
      // classes:
      //  processing - displays loading icon
      //  done - displays done icon
      e.preventDefault();

      var self = $(this);

      if ( false === self.hasClass('processing') && false === self.hasClass('done') ){
        self.addClass('processing');
        setTimeout(function(){
          self.removeClass('processing');
          self.addClass('done');
        }, 2000);
      }
    });


    try {
      if ( false === istouch && "undefined" !== Waves ){

        var timeout, ripple;
        Waves.attach('.ripple');
        Waves.init();

        doc.on('click', '.ripple', function(){

          ripple = $(this);
          ripple.addClass('clicked');
          if ( "undefined" !== timeout ) {
            clearTimeout( timeout );
          }
          setTimeout(function () {
            ripple.removeClass('clicked');
          }, 1200);
        });
      }
    } catch (e) {
      console.warn(e);
    }

  })();

  /* DOM ready animations */
  (function(){

    if (true === istouch){
      html.addClass('is-mobile');
    }

    html.addClass('start');

  })();

  // Pop up
  (function(){

    var suffix = '-open',
        delay = 250,
        processing = 0,
        already = 0,
        target;

    function drop(t){
      html.removeClass(already+suffix);
      processing = 1;
      setTimeout(function(){
        html.removeClass(already);
        doc.off('keyup.removepopup');
        already = processing = 0;
        forget();
      }, t);
    }

    function pick(){
      if ( 0 !== already ) drop(0);
      processing = 1;
      html.addClass(target);
      setTimeout(function(){
        html.addClass(target+suffix);
        already = target;
      }, 50);
      // prevent fast double click
      setTimeout(function(){
        listen();
        processing = 0;
      }, delay);
    }

    function listen(){
      doc.on('keyup.removepopup', function(e){
        27 == e.keyCode ? drop() : null;
      });
    }

    function forget(){
      doc.off('keyup.removepopup');
    }

    doc.on('click', '[data-popup]', function(e){
      e.preventDefault();
      if ( 0 === processing ){
        target = $(this).attr('data-popup').trim();
        target == already ? drop(delay) : pick();
      }
    });

  })();

  // Collapsable
  (function(){

    $.fn.triggerClass = function(){

      if ( true === this.hasClass('open') ){
        spark(this[0], 'toggle:collapsed');
      } else {
        spark(this[0], 'toggle:opened');
      }

      this.toggleClass('open');
    }

    $('[data-toggle]').on('click', function(){
      var el = $(this),
          cls = el.attr('data-toggle'),
          manual = el.attr('data-togglemanual') || false,
          target = el.closest( '.' + cls );

      target.triggerClass();

      if ( false === manual ){
        setTimeout(function(){
          doc.on('click.toggles', function(){
            target.triggerClass();
            doc.off('click.toggles');
          });
        }, 50);
      }
    });

  })();

  /* Header */
  (function(){

    var submenu = $('.sub-menu'),
        hamburger = $('.hamburger'),
        stickynav = $('#stickynav'),
        oncontent = false;

    // defualt value
    hamburger.opened = false;

    function isViewonPage(){

      setTimeout(function(){
        if ( 75 < win.scrollTop() ) {
          if ( false === oncontent ){
            oncontent = true;
            html.addClass('on-content');
          }
        } else if ( true === oncontent ) {
          oncontent = false;
          html.removeClass('on-content');
        }
      }, 0);
    }

    doc.on('ready', isViewonPage );
    win.on('scroll', isViewonPage );

    function open(){
      if ( false === hamburger.opened ) {
        html.addClass('side-menu');
        setTimeout(function(){
          html.addClass('side-menu-show');
          hamburger.opened = true;
        }, 50);
      }
    }

    function close(){
      if ( true === hamburger.opened ) {
        html.removeClass('side-menu-show');
        setTimeout(function(){
          html.addClass('side-menu');
          hamburger.opened = false;
        }, 300);
      }
    }

    function swipe(){

      if (false === istouch) return;

      try {

        $('.swipe-close').each(function(handle){

          var max = 320,
              now = 0;

          handle = new Hammer(this);

          handle.on('swipeleft', close);

          handle.on('panstart', function(e){
            stickynav.addClass('panned');
          });

          handle.on('panright panleft', function(e){

            now = now + ( 4 === e.direction ? Math.round( Math.max( 3, e.velocity ) ) : Math.round( Math.min( -3, e.velocity ) ) );

            if ( now > 0 ){
              now = 0;
            }

            if ( Math.abs(now) > max ){
              now = max * -1;
            }

            $('.swipe-close').css('transform', 'translateX(' + now + 'px)');
          });

          handle.on('panend pancancel', function(e){

            stickynav.removeClass('panned');

            if ( Math.abs(now) > max * 0.5 ){
              close();
            }

            $('.swipe-close').css('transform', '');
            now = 0;
          });
        });

      } catch (e) {
        console.warn(e);
      }
    }

    // swipe to close only on mobile
    swipe();

    doc.on('click', function(e, target){

      target = $(e.target);

      if ( true === hamburger.opened && e.pageX > 299
          && !( target.is('.hamburger') || target.parent().is('.hamburger') ) ) {

        close();
      }
    });

    hamburger.on('click', open);

    // Addind transition delay into sub-menu links
    if ( 0 !== submenu.length ){

      submenu.find('> li').each(function( index, delay ) {

        delay = 300 + 40 * index;
        delay = delay + 'ms, ' + delay + 'ms';

        $(this).find('> a').css({
          '-webkit-transition-delay': delay,
          'transition-delay': delay,
        });
      });
    }

  })();

  /* Search */
  (function(){

    var field = $('.search-field'),
        onsearch = false,
        focused = false,
        scroll = false;

    win.on('touchmove', function(e) {
      if ( true === focused ){
        e.preventDefault();
      }
    });

    field.on('focus blur', function(){
      focused = !focused;
    });

    doc.on('click', '.search-on', function(){

      if ( false === onsearch ){
        onsearch = true;
        html.addClass('on-search');
        spark(doc[0], 'search:actived');

        scroll = setTimeout(function() {
          html.addClass('disable-scroll');
        }, 50 );
      }
    });

    doc.on('click', '.search-off', function(){

      if ( true === onsearch ){
        onsearch = false;
        clearTimeout(scroll);
        html.removeClass('on-search disable-scroll');
        spark(doc[0], 'search:deactivated');
      }
    });

  })();

  // Search spinning icon
  (function(){

    var timeout;

    doc.on('search:actived', function(){
      if (false === istouch){
        $('[name="s"]').focus();
      }
    });

    $('[name="s"]').on('keyup', function(){

      if ( "undefined" !== timeout ) clearTimeout(timeout);
      html.addClass('searching');
      timeout = setTimeout(function () {
        html.removeClass('searching');
      }, 1500);
    });

  })();

  /* Global */
  (function(){

    // Sticky sidebars
    var stickySidebars = function(){

      try {

        if (false === istouch && "undefined" !== typeof $.fn.theiaStickySidebar ){

          $('.sticky-sidebar').theiaStickySidebar({
            'additionalMarginTop': 1,
            'additionalMarginBottom': 1,
            'minWidth': 1280
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // Tooltips
    var tootips = function(){
      try {
        new tooltip( $('[data-tooltip]'), {
          offset: 75,
          display: 1,
          delay: 100,
          duration: 2000,
          once: 1
        });
      } catch (e) {
        console.warn(e);
      }
    }

    // Owl Carousel
    var carousels = function(){

      try {
        var elm = $('.owl-carousel');
        if ( 0 !== elm.length ){
          elm.each(function(){
            $(this).owlCarousel({
              items: 1,
            });
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // Plyr
    var plyrs = function(){

      try {

        if ( "undefined" === typeof plyr ) return;

        var players = plyr.setup({
          controls: ['play', 'progress', 'mute'],
          autoplay: !istouch,
          fullscreen: {
            enabled: false
          },
          iconUrl: '/public/images/libs/plyr.svg'
        });

        if ( players ) {

          $.each( players, function(i, player){
            var self = player.getContainer(),
                featured = $(self).parents('.video-featured');

            if ( 0 !== featured.length ){
              featured.on('toggle:collapsed', function(){
                player.play();
              });
              featured.on('toggle:opened', function(){
                player.pause();
              });
            }
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // Masonry
    var stonework = function(){
      try {

        var grid = $('.archived-items');
        if ( 0 !== grid.length ){
          grid.masonry({
            // options
            itemSelector: '.item-box',
            // use element for option
            columnWidth: '.item-box.col-lg-6',
            percentPosition: true
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }

    stickySidebars();
    tootips();
    plyrs();
    stonework();
    carousels();

  })();

})(jQuery);


// Global Google map initMap function
function initMap() {

  'use strict'

  function draw( canvas, styles ){

    var self = this;

    function start(){

      self.options = window[canvas.getAttribute('data-map')];
      if ( self.options ) map();
    }

    function map(){

      self.map = new google.maps.Map(canvas, {
        scrollwheel: false,
        zoom: self.options.zoom || 4,
        center: self.options.location,
        styles: styles.theme
      });

      path();
    }

    function path(){

      if ( self.options.path ) {

        self.line = new google.maps.Polyline({
          geodesic: true,
          strokeOpacity: 1.0,
          strokeColor: self.options.path.color,
          strokeWeight: self.options.path.weight,
          path: self.options.path.coordinates
        });

        self.line.setMap(self.map);
      }

      marker();
    }

    function marker(){

      var markers = [];

      if ( self.line ) {

        markers.push({
          position: self.options.path.coordinates[0],
          icon: styles.markers.start
        });

        markers.push({
          position: self.options.path.coordinates.slice(-1).pop(),
          icon: styles.markers.finish
        });

      } else {

        markers.push({
          position: self.options.location,
          icon: styles.markers.defualt
        });
      }

      for (var i = 0, len = markers.length; i < len; i++) {
        addMarker( markers[i] );
      }

      setTimeout(info, 50);
    }

    function addMarker( i ){

      if ( !self.marker ) self.marker = [];

      setTimeout(function(){

        self.marker.push( new google.maps.Marker({
          map: self.map,
          animation: google.maps.Animation.DROP,
          position: i.position,
          draggable: false,
          optimized: false,
          icon: {
            url: i.icon.url,
            scaledSize: new google.maps.Size(i.icon.size[0], i.icon.size[1])
          }
        }));
      }, 0 );
    }

    function info(){

      if ( self.options.infowindows ) {
        for (var i = 0, len = self.marker.length; i < len; i++) {
          if ( self.options.infowindows[i] ){
            addInfo(self.options.infowindows[i], self.marker[i])
          }
        }

        // console.log(self.info);
      }
    }

    function addInfo(i, m){

      if ( !self.info ) self.info = [];

      var info = new google.maps.InfoWindow({
        content: i
      });

      self.info.push(info);

      m.addListener('click', function() {
        info.open(self.map, m);
      });
    }

    start();
  }

  function init(){

    var maps = document.querySelectorAll('[data-map]'),
        styles = getStyles();

    if ( maps ){
      for (var i = 0, len = maps.length; i < len; i++) {
        var canvas = new draw( maps[i], styles );
      }
    }
  }

  function getStyles(){

    try {
      return googleMapStyles;
    } catch (e) {
      return {
        markers: {
          defualt: {
            url: '/public/images/icons/room.svg',
            size: [48,48]
          },
          start: {
            url: '/public/images/icons/room.svg',
            size: [32,32]
          },
          finish: {
            url: '/public/images/icons/flag.svg',
            size: [32,32]
          }
        },
        theme: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#dedede"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]

      }
    }
  }

  setTimeout(init, 0);
}
