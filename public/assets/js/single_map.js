(function ($) {
    "use strict";

    $(function () {

        var map, i, markerCluster;
        var arrMarkers = [];

        //var boxText = document.createElement("div");
        //boxText.className = 'map-box';

        var currentInfobox;

        /*
				var clusterStyles = [
				  {
					textColor: 'white',
					url: travellerpress_general_settings.wpv_url+'/images/m1.png',
					height: 50,
					width: 50
				  },
				 {
					textColor: 'white',
					url: travellerpress_general_settings.wpv_url+'/images/m1.png',
					height: 50,
					width: 50
				  },
				 {
					textColor: 'white',
					url: travellerpress_general_settings.wpv_url+'/images/m1.png',
					height: 50,
					width: 50
				  },
				 {
					textColor: 'white',
					url: travellerpress_general_settings.wpv_url+'/images/m1.png',
					height: 50,
					width: 50
				  },
				  {
					textColor: 'white',
					url: travellerpress_general_settings.wpv_url+'/images/m1.png',
					height: 50,
					width: 50
				  }
				];

				var boxOptions = {
					content: boxText,
					disableAutoPan: true,
					alignBottom : true,
					maxWidth: 0,
					pixelOffset: new google.maps.Size(-60, -5),
					zIndex: null,
						boxStyle: {
						width: parseFloat(travellerpress_general_settings.infobox_width)+"px"
					},
					closeBoxMargin: "0",
					closeBoxURL: "",
					infoBoxClearance: new google.maps.Size(1, 1),
					isHidden: false,
					pane: "floatPane",
					enableEventPropagation: false,
			  };
		*/

        function iconColor(color) {
            var s = travellerpress_general_settings.scale;
            return {
                iconUrl: encodeURI("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='37' height='47'><path d='M19.9,0c-0.2,0-1.6,0-1.8,0C8.8,0.6,1.4,8.2,1.4,17.8c0,1.4,0.2,3.1,0.5,4.2c-0.1-0.1,0.5,1.9,0.8,2.6c0.4,1,0.7,2.1,1.2,3 c2,3.6,6.2,9.7,14.6,18.5c0.2,0.2,0.4,0.5,0.6,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0.2-0.2,0.4-0.5,0.6-0.7c8.4-8.7,12.5-14.8,14.6-18.5 c0.5-0.9,0.9-2,1.3-3c0.3-0.7,0.9-2.6,0.8-2.5c0.3-1.1,0.5-2.7,0.5-4.1C36.7,8.4,29.3,0.6,19.9,0z M2.2,22.9 C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,3,25.2,2.2,22.9z M19.1,26.8c-5.2,0-9.4-4.2-9.4-9.4 s4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4S24.3,26.8,19.1,26.8z M36,22.9C35.2,25.2,36,22.9,36,22.9C36,22.9,36,22.9,36,22.9 C36,22.9,36,22.9,36,22.9z M13.8,17.3a5.3,5.3 0 1,0 10.6,0a5.3,5.3 0 1,0 -10.6,0' fill='" + color + "'/></svg>").replace('#', '%23'),
                iconSize: new L.Point(37 * s, 48 * s),
                iconAnchor: new L.Point(19 * s, 52 * s)
            };
        }

        if (singlemap.centerPoint) {
            var latlngStr = travellerpress_settings.centerPoint.replace('(', '').split(",", 2);
            var lat = parseFloat(latlngStr[0]);
            var lng = parseFloat(latlngStr[1]);
            var center = new L.LatLng(lat, lng);
        } else {
            var center = new L.LatLng(-33.92, 151.25);
        }

		/*
		if(singlemap.map_el_style){
			var mapstyle = JSON.parse(singlemap.map_el_style.style);
		} else {

			var mapstyle = [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}];
		}
		*/
        if (singlemap.map_el_zoom === 'auto') {
            var set_zoom = 10;
        } else {
            var set_zoom = parseInt(singlemap.map_el_zoom);
        }

        //var maptype = singlemap.map_el_type;

        function initialize() {

            map = new L.map(document.getElementById('map_elements'), {
                zoom: set_zoom,
                center: center,
                layers: new L.TileLayer("//stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"),
                attributionControl: false
            });
            map.getPane('mapPane').style.zIndex = 0;

            var bounds = new L.LatLngBounds();

            if (singlemap.locations) {
                // add markers to map

                for (var key in singlemap.locations) {

                    var data = singlemap.locations[key];

                    var marker_content = '<div class="map-box infoBox" style="width: 285px">'
                        + data['ibdata'] + '</div>';

                    var marker = new L.Marker([data.pointlat, data.pointlong], {
                        icon: new L.icon(data['pointicon_image'] ? data['pointicon_image'] : iconColor(data.icon))
                    });

                    marker.id = data.id;
                    marker.bindPopup(marker_content).on('popupopen', function (e) {
                        currentInfobox = this.id;
                    });
                    marker.addTo(map);

                    arrMarkers[data['id']] = marker;

                    //extend the bounds to include each marker's position
                    bounds.extend(marker.getLatLng());

                } //eof for/ adding markers

            } //eof locations

			/*
						if(singlemap.polygons) {
							for (var key in singlemap.polygons) {
								var data = singlemap.polygons[key];

								var polygon = new google.maps.Polygon({
									paths: google.maps.geometry.encoding.decodePath(data['encodedpolygon']),
									strokeColor: data['polygoncolor'],
									strokeOpacity: 0.8,
									strokeWeight: 2,
									fillColor: data['polygoncolor'],
									fillOpacity: 0.35,
									id: data['id'],
									ibcontent: data['ibdata'],
								});

								polygon.setMap(map);

								if(data['ibdata']) {
									google.maps.event.addListener(polygon, 'click', function() {
										 ib.close();
										ib.setOptions(boxOptions);
										boxText.innerHTML = this.ibcontent;
										ib.setPosition(this.getBounds().getCenter());
										ib.open(map);
										currentInfobox = this.id;
										var latLng = this.getBounds().getCenter();
										map.panTo(latLng);
										var winWidth = $(window).width();

										if( winWidth >= 1470) {
											map.panBy(90,-155);
										}
										if( winWidth > 769 && winWidth < 1470  ) {
											map.panBy(90,-185);
										}
										if( winWidth < 768) {
											map.panBy(90,-125);
										}

										google.maps.event.addListener(ib,'domready',function(){
										  $('.infoBox-close').click(function() {
											  ib.close();
										  });
										});
									});
								}

								bounds.extend(polygon.getBounds().getCenter());
							}
						} //eof polygons

						if(singlemap.polylines) {
							for (var key in singlemap.polylines) {
								var data = singlemap.polylines[key];

								var polyline = new google.maps.Polyline({
									strokeColor : data['polylinecolor'],
									strokeOpacity : 1.0,
									strokeWeight : 3,
									path: google.maps.geometry.encoding.decodePath(data['encodedpolyline']),
									geodesic: true,
									id: data['id'],
									ibcontent: data['ibdata']
								  });


									polyline.setMap(map);

									var path = polyline.getPath();
									var middle = Math.round(path.getLength()/2);


									if(data['ibdata']) {
									google.maps.event.addListener(polyline, 'click', function() {
										ib.setOptions(boxOptions);
										 ib.close();
										boxText.innerHTML = this.ibcontent;
										ib.setPosition(this.getPath().getAt(middle))
										var latLng = this.getPath().getAt(middle);
										map.panTo(latLng);
										var winWidth = $(window).width();

										if( winWidth >= 1470) {
											map.panBy(90,-155);
										}
										if( winWidth > 769 && winWidth < 1470  ) {
											map.panBy(90,-185);
										}
										if( winWidth < 768) {
											map.panBy(90,-125);
										}
										ib.open(map);
										currentInfobox = this.id;

										google.maps.event.addListener(ib,'domready',function(){
										  $('.infoBox-close').click(function() {
											  ib.close();
										  });
										});
									});
								}

								bounds.extend(polyline.getBounds().getCenter());
							}
						}
						if(singlemap.kml) {
							for (var key in singlemap.kml) {
								var data = singlemap.kml[key];
								var kmllayer = new google.maps.KmlLayer({
										url: data['url'],
										preserveViewport: true,
										map: map
									  });
								  //kmllayer.setMap(map);

								}
						}

						var options = {
							imagePath: travellerpress_general_settings.wpv_url+'/images/m',
							styles : clusterStyles,
							minimumClusterSize : travellerpress_general_settings.min_cluster_size,
							maxZoom: travellerpress_general_settings.max_cluster_zoom

						};

						if(travellerpress_general_settings.clusters_status){
							markerCluster = new MarkerClusterer(map, arrMarkers, options);
						}
			*/

            if (singlemap.map_el_zoom != 'auto') {
                if (!singlemap.centerPoint) {
                    center = bounds.getCenter();
                }
                map.setView(center, set_zoom)
            } else {
                if (!singlemap.centerPoint) {
                    map.fitBounds(bounds);
                }
            }

            if (singlemap.map_auto_open === 'yes') {
                arrMarkers[0].openPopup();
            }

        } //eof initialize

        $('#nextpoint').click(function (e) {
            e.preventDefault();
            var index = currentInfobox;
            if (index + 1 < arrMarkers.length) {
                arrMarkers[index + 1].openPopup();
            } else {
                arrMarkers[0].openPopup();
            }
        })


        $('#prevpoint').click(function (e) {
            e.preventDefault();
            if (typeof (currentInfobox) == "undefined") {
                arrMarkers[arrMarkers.length - 1].openPopup();
            } else {
                var index = currentInfobox;
                if (index - 1 < 0) {
                    //if index is less than zero than open last marker from array
                    arrMarkers[arrMarkers.length - 1].openPopup();
                } else {
                    arrMarkers[index - 1].openPopup();
                }
            }

        })

        L.DomEvent.on(window, 'load', initialize);

		/*
		  if (!google.maps.Polygon.prototype.getBounds) {
				  google.maps.Polygon.prototype.getBounds=function(){
				  var bounds = new google.maps.LatLngBounds()
				  this.getPath().forEach(function(element,index){bounds.extend(element)})
				  return bounds
			  }
		  }
		  if (!google.maps.Polyline.prototype.getBounds) {
			  google.maps.Polyline.prototype.getBounds = function() {
				  var bounds = new google.maps.LatLngBounds();
				  this.getPath().forEach( function(latlng) { bounds.extend(latlng); } );
			  return bounds;
			  }
		  }
  */

    });

}(jQuery));
