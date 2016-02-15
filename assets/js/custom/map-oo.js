var ooSearch = {
	markers: [],
	map: {},
	records: [],
	init: function () {
			// add IE8 and below support for indexOf function
			if (!Array.prototype.indexOf)
			{
				Array.prototype.indexOf = function(elt /*, from*/)
				{
					var len = this.length >>> 0;

					var from = Number(arguments[1]) || 0;
					from = (from < 0)
					? Math.ceil(from)
					: Math.floor(from);
					if (from < 0)
						from += len;

					for (; from < len; from++)
					{
						if (from in this &&
						    this[from] === elt)
							return from;
					}
					return -1;
				};
			}

			// cache elements
			this.searchContainer = $("div.oo-container");
			this.searchButton = $("button.oo-search");
			this.searchResultsArea = $("div.oo-output");
			this.searchAgainButton = $("button.oo-search-again");
			this.searchInputs = $("input.oo-input");

			// load the map
			ooSearch.loadMap();
		},

		loadMap: function () {
			// remove points of interest from map
			var styles =[
			{
				featureType: "poi",
				elementType: "labels",
				stylers: [
				{ visibility: "off" }
				]
			}
			];

			ooSearch.map = new google.maps.Map(document.getElementById("oo-map"), {
				zoom: 10,
				center: new google.maps.LatLng(51.2088793, 0.4261792),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true,
				styles: styles,
                		scrollwheel: false
			});
		},

		bindEvents: function (i) {
			var o = ooSearch;
			// marker click events
			return function () {
				o.clearInfoWindows();
				if (this.getAnimation()) {
					this.setAnimation(null);
					o.markers[i].infoWindow.close();
				} else {
					o.stopMarkerAnimation();
					this.setAnimation(google.maps.Animation.BOUNCE);
					o.markers[i].infoWindow.open(o.map, o.markers[i].marker);
					var scrolled = false;
					for (var a = 0; a < o.records.length; a += 1) {
						if (o.records[a].coordinatesUniqueId === o.markers[i].uniqueId) {

							$(".oo-venue-title").not(o.records[a].div.parent().siblings(".oo-venue-title")).each(function () {
								if (!($(this).attr("data-hidden") === "true")) {
									$(this).click();
								}
							});
							if (o.records[a].div.parent().siblings(".oo-venue-title").attr("data-hidden") === "true") {
								o.records[a].div.parent().siblings(".oo-venue-title").click();
							}

							if (!scrolled) {
								o.records[a].div.parent().parent().velocity("scroll", { container: o.searchResultsArea, duration: 500, easing: 'easeInOutCubic' });
								scrolled = true;
							}

						}
					}
					o.getNewMapCentre(this.getPosition(), 250, 0);
				}
			};
		},

		infoWindowCloseClicked: function () {
			return function () {
				o.clearInfoWindows();
				o.stopMarkerAnimation();
			};
		},

		clearInfoWindows: function () {
			var o = ooSearch;
			var len = o.markers.length;
			for (var i = 0; i < len; i += 1) {
				o.markers[i].infoWindow.close();
			}
		},

		stopMarkerAnimation: function () {
			var o = ooSearch;
			len = o.markers.length;
			for (i = 0; i < len; i += 1) {
				o.markers[i].marker.setAnimation(null);
			}
		},

		addMarkers: function () {
		},

		removeMarkers: function () {
			var o = ooSearch;
			var len = o.markers.length;
			for(i=0; i < len; i++) {
				o.markers[i].marker.setMap(null);
			}
			o.markers = [];
		},

		animateElements: function (mobile) {
			var o = ooSearch;
			o.searchContainer.children("h2").velocity("fadeOut", 500);
			o.searchContainer.children("input").velocity("fadeOut", 500);
			o.searchContainer.children("button").velocity("fadeOut", 500, function() {
				o.searchContainer.removeClass('oo-search-window-active');
				o.searchContainer.addClass('oo-results-window-active');
				$("div.oo-output-container").velocity("fadeIn", 500);
				$("div.oo-output").velocity("fadeIn", 500);
				o.searchResultsArea.css("display", "block").html(spinner.el).children(".spinner").css("display", "none").velocity("fadeIn", 500, function () {
					o.getResponse();
				});
			});
		},

		animateElementsBack: function (mobile) {
			var o = ooSearch;
			// animate elements back to their original state
			if ($("div.oo-venue").length) {
				$("div.oo-venue").velocity("fadeOut", 500);
			}
			if ($("div.oo-output").length) {
				$("div.oo-output").velocity("fadeOut", 500);
			}
			if ($("div.oo-result").length) {
				$("div.oo-result").velocity("fadeOut", 500);
			}
			if ($("div.oo-no-result").length) {
				$("div.oo-no-result").velocity("fadeOut", 500);
			}

			if ($("div.oo-more-results").length) {
				$("div.oo-more-results").velocity("fadeOut", 500);
			}

			$("div.oo-output-container").velocity("fadeOut", 500, function () {
				o.searchContainer.removeClass('oo-results-window-active');
				o.searchContainer.addClass('oo-search-window-active');
				o.searchContainer.children("input").val("");
				o.searchContainer.children("h2").velocity("fadeIn", 500);
				o.searchContainer.children("input").velocity("fadeIn", 500, function() {
					o.searchContainer.children("input:first").focus();
					o.searchContainer.children("button").velocity("fadeIn", 500);
				});
			});
		},

		getNewMapCentre: function (latlng,offsetx,offsety) {
			var o = ooSearch;
			var point1 = o.map.getProjection().fromLatLngToPoint(
				(latlng instanceof google.maps.LatLng) ? latlng : o.map.getCenter()
			);
			var point2 = new google.maps.Point(
				( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, o.map.getZoom()) ) || 0,
				( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, o.map.getZoom()) ) || 0
			); 
			o.map.panTo(o.map.getProjection().fromPointToLatLng(new google.maps.Point(
				point1.x - point2.x,
				point1.y + point2.y
			)));
		},

		centerMap: function () {
			var o = ooSearch;
			var latlngbounds = new google.maps.LatLngBounds();
			var len = o.records.length;
			for (var i = 0; i < len; i += 1) {
				latlngbounds.extend(o.records[i].coordinates);
			}
			o.map.fitBounds(latlngbounds);
			// enforce minimum zoom level
			var zoom = o.map.getZoom();
			o.map.setZoom(zoom > 12 ? 12 : zoom);
			o.getNewMapCentre(latlngbounds.getCenter(), 250, 0);
		},

		getResponse: function (index) {
			var site = 'https://api.openobjects.com/rest/v1/kent/records?key=cd6fc53d-7751-4bd3-804c-90f1dfc6bef5&query=%2Bservice_type:event';
			var query = $("input.oo-query").val();
			var location = $("input.oo-location").val();
			if (query !== ""  && query !== null && query !== " ") {
				query = encodeURIComponent(query);
				site += "+%2B" + query;
			}
			if (location !== ""  && location !== null && location !== " ") {
				site += "&spatialLocation=" + location;
				site += "&spatialRadius=5";
			}
			site += "&count=10";
			site += "&sortType=field&sortOrder=0&sortField=venue_name";
			if (index) {
				site += "&startIndex=" + index;
			}

			// Use YQL as workaround to allow XML response to be pulled from cross-domain site
			try {
				this.yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';
			} catch(err) {
				alert("error");
			}
			ooSearch.site = site;
			ooSearch.processResponse();
		},

		addLinks: function (i) {
			return function () {
				window.location.href = ooSearch.records[i].url;
			};
		},

		processResponse: function () {
			var o = ooSearch;
			$.getJSON(o.yql, function(data) {

				// Parse XML using jQuery
				var xmlDoc = $.parseXML( data['results'][0] ),
				$xml = $( xmlDoc ),
				$records = $xml.find( "record" ),
				number_of_records = $records.length;

				o.searchResultsArea.html("");
				o.nextPage = null;
				if (!number_of_records) {
					o.searchResultsArea.append('<div class="oo-no-result">No results found. Please <a href="#" class="oo-try-searching-again">try another search</a>.</div>')
					.css("display", "none")
					.velocity("fadeIn", 500);
					$("a.oo-try-searching-again").click(function () {
						$("button.oo-search-again").click();
					});
					return;
				}

				o.records = [];
				var searchResultsBuilder = [];
				var i = 0;
				$records.each(function (index, el) {
					if (!  ($( this ).find( "location_postcode__latitude__stored" ).length &&
					    $( this ).find( "location_postcode__longitude__stored" ).length &&
					    $( this ).find( "venue_name" ).length)  ) {
						return true;
				}

				o.records.push({});

				o.records[i].recordId = $( this ).find( "id" ).text();
				o.records[i].url = "http://search3.openobjects.com/kb5/kent/directory/event.page?id=" + o.records[i].recordId;

				o.records[i].lat = $( this ).find( "location_postcode__latitude__stored" );
				o.records[i].lng = $( this ).find( "location_postcode__longitude__stored" );
				if ( o.records[i].lat.length && o.records[i].lng.length ) {
					o.records[i].lat = parseFloat( o.records[i].lat.text() );
					o.records[i].lng = parseFloat( o.records[i].lng.text() );

					var temp_coordinates = (o.records[i].lat + o.records[i].lng).toString();
					var coordinates = new google.maps.LatLng(o.records[i].lat, o.records[i].lng);

					o.records[i].coordinates = coordinates;
					o.records[i].coordinatesUniqueId = temp_coordinates;

				}

				o.records[i].venue = $(this).find( "venue_name" ).text();
				o.records[i].venueId = o.records[i].venue.replace(/ /g, "-").replace(/,/g, "").replace(/\./g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/&/g, "").replace(/\'/g, "").replace(/[1-9]/g, "");

				o.records[i].title = $( this ).find( "title" ).text();
				o.records[i].description = ($( this ).find( "description" ).text()) ? $( this ).find( "description" ).text().replace("<p>", "").replace("</p>","").replace("<span>", "").replace("</span>", "").replace("<div>", "").replace("</div>", "") : "No description available.";
				o.records[i].siteName = $( this ).find( "venue_name" ).text();
					// build search result structure
					searchResultsBuilder.push('<div class="oo-result oo-record-' + i + '">' +
					'<p class="oo-title"><a href="' + o.records[i].url + '">' + o.records[i].title + '</a></p>' +
					'<p class="oo-description">' + o.records[i].description + '</p>' +
					'</div>');
					i++;
				});

				if (!(o.records.length)) {
					o.searchResultsArea.append('<div class="oo-no-result">No results found. Please <a href="#" class="oo-try-searching-again">try another search</a>.</div>')
					.css("display", "none")
					.velocity("fadeIn", 500);
					$("a.oo-try-searching-again").click(function () {
						$("button.oo-search-again").click();
					});
					return;
}

					// insert search results into document
					//o.searchResultsArea.append(searchResultsBuilder);
					o.venues = [];
					var len = o.records.length;
					for (var i = 0; i < len; i += 1) {

						// o.records[i].venue = venues[Math.floor((Math.random() * venues.length))].replace(" ", "-");
						var isIE8;
						if( $('html').hasClass('lt-ie9') ){
							isIE8 = true;
						} else {
							isIE8 = false;
						}
						if (!(o.searchResultsArea.find("div." + o.records[i].venueId).length)) {
							o.venues.push(o.records[i].venueId);
							if( isIE8 ){
								o.searchResultsArea.append('<div class="oo-venue ' + o.records[i].venueId + '"><div class="oo-venue-title" tabindex="0">' + o.records[i].venue + '<div class="icon-arrow-minus-ie8 icon-open"></div></div><div class="oo-results-container"></div></div>');
							} else {
								o.searchResultsArea.append('<div class="oo-venue ' + o.records[i].venueId + '"><div class="oo-venue-title" tabindex="0">' + o.records[i].venue + '<div class="icon-arrow-minus icon-open"></div></div><div class="oo-results-container"></div></div>');
							}
						}
						o.searchResultsArea.find("div." + o.records[i].venueId).find("div.oo-results-container").append(searchResultsBuilder[i]);

						o.records[i].div = o.searchResultsArea.find("div.oo-record-" + i);
						o.records[i].div.hide();

					}
					o.searchResultsArea.find("div.oo-result").velocity( "fadeIn", 500 );

					// add link to show more results if they are available
					if ($xml.find( "nextPage" ).length) {
						o.nextPage = $xml.find( "nextPage" ).text();
						o.nextPage = o.nextPage.substring(o.nextPage.indexOf("startIndex=") + 11, o.nextPage.indexOf("&count="));
						o.searchResultsArea.append('<div class="oo-more-results">').find("div.oo-more-results")
						.append('<a href="#" class="oo-more-results-link">Show more results</a>')
						.find("a.oo-more-results-link").click(function () {

							if ($("div.oo-result").length) {
								$("div.oo-result").velocity("fadeOut", 500);
							}

							if ($("div.oo-venue").length) {
								$("div.oo-venue").velocity("fadeOut", 500);
							}

							$(this).velocity("fadeOut", 500, function() {
								o.searchResultsArea.html(spinner.el).children(".spinner").css("display", "none").velocity("fadeIn", 500);

								var len = o.markers.length;
								for (i = 0; i < len; i += 1) {
									google.maps.event.clearListeners(o.markers[i].marker, 'click');
								}

								o.getResponse(o.nextPage);
							});
						});
					}

					o.removeMarkers();
					o.centerMap();

					// remove duplicates and add markers
					var temp_array = [];
					var outer_len = o.records.length;
					for (i = 0; i < outer_len; i += 1) {

						if (temp_array.indexOf(o.records[i].coordinatesUniqueId) === -1) {
							temp_array.push(o.records[i].coordinatesUniqueId);

							var marker = new google.maps.Marker({
								map: o.map,
								animation: google.maps.Animation.DROP,
								position: o.records[i].coordinates
							});

							o.markers.push({marker: marker, uniqueId: o.records[i].coordinatesUniqueId, siteName: o.records[i].siteName});
							o.records[i].marker = o.markers[o.markers.length-1].marker;
							o.markers[o.markers.length-1].infoWindow = new google.maps.InfoWindow({
								content: '<p style="text-align:center; margin: 0; padding: 0;  white-space: nowrap;">' + o.records[i].venue + '</p>',
      							maxWidth: 300, //o.markers[o.markers.length-1].siteName
      							disableAutoPan: true
      						});

						} else {
							var inner_len = o.markers.length;
							for (var a = 0; a < inner_len; a += 1) {
								if (o.markers[a].uniqueId === o.records[i].coordinatesUniqueId) {
									o.records[i].marker = o.markers[a].marker;
									break;
								}
							}
						}
					}

					// binds marker and info window click events
					len = o.markers.length;
					for ( i = 0; i < len; i += 1 ) {
						google.maps.event.addListener(o.markers[i].marker, 'click', o.bindEvents(i));
						google.maps.event.addListener(o.markers[i].infoWindow, 'closeclick', o.infoWindowCloseClicked(i));
					}

					$(".oo-venue-title").click(function () {
						var header = $(this);
						if (header.siblings(".oo-results-container").eq(0).hasClass("velocity-animating")) {
							return;
						}
						if (header.attr("data-hidden") === "true") {
							header.children('.icon-arrow-minus').addClass("icon-open");
							header.siblings(".oo-results-container").velocity("slideDown", { duration: 500, easing: 'easeInOutCubic', complete: function() {
								header.attr("data-hidden", "false");
							}
						}); 
						} else {
							header.children('.icon-arrow-minus').removeClass("icon-open");
							header.siblings(".oo-results-container").velocity("slideUp", { duration: 500, easing: 'easeInOutCubic', complete: function() {
								header.attr("data-hidden", "true");
							}
						});
						}
					});

					$("div.oo-venue-title").on( "keyup", function(e) {
						var code = e.keyCode || e.which;
								 if(code == 13) { //Enter keycode
								 	$(this).click();
								 }
								});

					// binds search result records click event
					//len = o.records.length;
					//	for ( i = 0; i < len; i += 1 ) {
					//	o.records[i].div.click(o.addLinks(i));
					//}

				});
}
};

	var o = ooSearch;
	o.init();

	o.searchButton.click(function () {
		if( $(window).width() >= 640 ){
			o.animateElements(false);
		} else {
			o.animateElements(true);
		}
	});

	o.searchAgainButton.click(function () {
		// remove event listeners from markers
		var len = o.markers.length;
		for (i = 0; i < len; i += 1) {
			google.maps.event.clearListeners(o.markers[i].marker, 'click');
		}

		if( $(window).width() >= 640 ){
			o.animateElementsBack(false);
		} else {
			o.animateElementsBack(true);
		}

		o.removeMarkers();

		// reset map position
		o.map.panTo(new google.maps.LatLng(51.2088793, 0.4261792));
		o.map.setZoom(10);

	});

	// submits search if enter key is pressed
	o.searchInputs.on( "keyup", function(e) {
		var code = e.keyCode || e.which;
		if(code == 13) { //Enter keycode
			o.searchButton.click();
		}
	});

	$(document).ready(function () {
	//spin.js
	var opts = {
		lines: 11, // The number of lines to draw
		length: 10, // The length of each line
		width: 3, // The line thickness
		radius: 8, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#000', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: '50%', // Top position relative to parent
		left: '50%' // Left position relative to parent
	};

	spinner = new Spinner(opts).spin();
	});