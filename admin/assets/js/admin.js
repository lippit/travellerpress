(function ( $ ) {
	"use strict";

	$(function () {

		var poly,geocoder,map_main,map_elements,marker,currentInfobox,listenerHandle;
		var markers = [];
		var polymarkers = [];
		var polylinemarkers = [];

	    var mapCenter = new L.LatLng(54.19265, 16.1779);

		//var path = new google.maps.MVCArray;

		//var ib = new InfoBox();

		//var boxText = document.createElement("div");
		//boxText.className = 'map-box';

/*
		var boxOptions = {
              content: boxText,
              disableAutoPan: true,
              alignBottom : true,
              maxWidth: 0,
              pixelOffset: new google.maps.Size(-60, -5),
              zIndex: null,
              boxStyle: {
                width: "300px"
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
            return {
                iconUrl: encodeURI("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='37' height='47'><path d='M19.9,0c-0.2,0-1.6,0-1.8,0C8.8,0.6,1.4,8.2,1.4,17.8c0,1.4,0.2,3.1,0.5,4.2c-0.1-0.1,0.5,1.9,0.8,2.6c0.4,1,0.7,2.1,1.2,3 c2,3.6,6.2,9.7,14.6,18.5c0.2,0.2,0.4,0.5,0.6,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0.2-0.2,0.4-0.5,0.6-0.7c8.4-8.7,12.5-14.8,14.6-18.5 c0.5-0.9,0.9-2,1.3-3c0.3-0.7,0.9-2.6,0.8-2.5c0.3-1.1,0.5-2.7,0.5-4.1C36.7,8.4,29.3,0.6,19.9,0z M2.2,22.9 C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,3,25.2,2.2,22.9z M19.1,26.8c-5.2,0-9.4-4.2-9.4-9.4 s4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4S24.3,26.8,19.1,26.8z M36,22.9C35.2,25.2,36,22.9,36,22.9C36,22.9,36,22.9,36,22.9 C36,22.9,36,22.9,36,22.9z M13.8,17.3a5.3,5.3 0 1,0 10.6,0a5.3,5.3 0 1,0 -10.6,0' fill='" + color + "'/></svg>").replace('#', '%23'),
                iconSize: new L.Point(37, 48),
                iconAnchor: new L.Point(19, 52)
            };
        }

        //parse array locations if it exists
        if(locations) {
            $.each(locations, function(i, location){
                markers.push({
                    lat: location.pointlat,
                    lng: location.pointlong,
                    address: location.pointaddress,
                    image_icon: location.pointicon_image,
                    data: location.ibdata,
                    icon: location.icon,
                    id: location.id,
                });
            });
       	}

       	var arrMarkers = {};
       	var arrPolygons = {};
       	var arrPolylines = {};

		/*tabs*/
		$("#map-details-tabs .hidden").removeClass('hidden');
		var lasttab = $('#map_last_tab').val();

		if(!lasttab) { lasttab = 'points'}

		var index = $('a[data-tab="'+lasttab+'"]').parent().index();

    	$("#map-details-tabs").tabs().tabs("option", "active", index ).removeClass('ui-widget');;

    	$('.map-details-tabs li a').on('click', function(){
    		var tab = $(this).data('tab');
    		$('#map_last_tab').val(tab);
    	})

    	//set the post edit map
    	function initialize() {

	    	//geocoder = new google.maps.Geocoder();

			if(centerPoint) {
				var latlngStr = centerPoint.replace('(','').split(",",2);
				var lat = parseFloat(latlngStr[0]);
				var lng = parseFloat(latlngStr[1]);
				var center = new L.LatLng(lat, lng);
			} else {
				var center = new L.LatLng(-33.92, 151.25);
			}

			map_elements = new L.map(document.getElementById('map-elements'), {
			  zoom: 10,
			  center: center,
			  layers: new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
			});

			if(locations) {
	            var bounds = new L.LatLngBounds();

                // add markers to map_elements
	            for (var key in markers) {
                    var data = markers[key];

                    var marker = new L.Marker([data['lat'], data['lng']], {
                        draggable : true,
                        title:"This a "+data['id']+" marker!",
                        icon: L.icon(data['image_icon'] ? data['image_icon'] : iconColor(data['icon'])),
                    });
                    marker.id = data['id'];
                    marker.bindPopup(data['data']).on('popupopen', function (e) {
                        currentInfobox = this.id;
                    });
                    marker.addTo(map_elements);

                    arrMarkers[data['id']] = marker;

                    marker.on('dragend', function(evt){
                        $("table#mappoints-datatable tr:eq("+this.id+") .point-lat").val(this.getLatLng().lat);
                        $("table#mappoints-datatable tr:eq("+this.id+") .point-long").val(this.getLatLng().lng);
                     //geocodePosition(this.getPosition(), this);
                    });

                    //extend the bounds to include each marker's position
					bounds.extend(marker.getLatLng());

					//add infoboxes

				} //eof for/ adding markers

				//now fit the map to the newly inclusive bounds
				if(!centerPoint && bounds.isValid()) {
					map_elements.fitBounds(bounds);
                }
                /*
				var listener = google.maps.event.addListener(map_elements, "idle", function () {
				    map_elements.setZoom(3);
				    google.maps.event.removeListener(listener);
                });
                */

				//drag markers
	        } //eof locations

/*
	        if(polygons) {
	        	for (var key in polygons) {
	        		var data = polygons[key];
	        		var polygon = new google.maps.Polygon({
					    paths: google.maps.geometry.encoding.decodePath(data['encodedpolygon']),
					    strokeColor: "#FF0000",
					    strokeOpacity: 0.8,
					    strokeWeight: 2,
					    fillColor: "#FF0000",
					    fillOpacity: 0.35,
					    id: data['id'],
					    ibcontent: data['ibdata'],
					});

					polygon.setMap(map_elements);
					arrPolygons[key] = polygon;

					google.maps.event.addListener(polygon, 'click', function() {
				    	ib.setOptions(boxOptions);
			            boxText.innerHTML = this.ibcontent;
			            ib.setPosition(this.getBounds().getCenter());
			            ib.open(map_elements);
			            currentInfobox = this.id;
			    	});
	        	}
	        }

	        if(polylines) {
	        	for (var key in polylines) {
	        		var data = polylines[key];

	        		var polyline = new google.maps.Polyline({
	        			strokeColor : data['polylinecolor'],
				        strokeOpacity : 1.0,
				        strokeWeight : 3,
					    path: google.maps.geometry.encoding.decodePath(data['encodedpolyline']),
    					geodesic: true,

    					id: data['id'],
    					ibcontent: data['ibdata']
					  });
					  polyline.setMap(map_elements);
					  arrPolylines[key] = polyline;


			        google.maps.event.addListener(polyline, 'click', function() {
				    	 ib.setOptions(boxOptions);
			             boxText.innerHTML = this.ibcontent;
			             ib.setPosition(this.getPath().getAt(1))
			             ib.open(map_elements);
			             currentInfobox = this.id;
				    });

	        	}
	        }
			if(kml) {
	        	for (var key in kml) {
	        		var data = kml[key];
			        var kmllayer = new google.maps.KmlLayer({
						    url: data['url'],
						    preserveViewport: true,
						  });
					  kmllayer.setMap(map_elements);

			  	}
            }
*/
        } //eof initialize

        var map = document.getElementById('map-elements');
        if (typeof (map) != 'undefined' && map != null) {
            L.DomEvent.on(window, 'load', initialize);
        }

		/************
		*** Markers
		************/
		runGeocode();
		// add new marker form
		function add_mappoint_formpart(id,lastmarkerid){
			$("table.point-clone tr:first").clone().find("input, textarea").each(function() {
    			$(this).val('');
    		}).end().
    		data('markerid',lastmarkerid)
    		.appendTo("table#"+id+"")
    		.find('td.address,td.point-icon')
    		.data('markerid',lastmarkerid).trigger( "addGeocodeInput");
			runGeocode();

		}

		$("#mappoints_addnew").on("click", function(e){
			var lastmarkerid = $("table#mappoints-datatable tr:last").data('markerid');
			if(!lastmarkerid) { lastmarkerid = 0; }
			lastmarkerid = parseInt(lastmarkerid)+1;

			e.preventDefault();
			add_mappoint_formpart('mappoints-datatable',lastmarkerid); //duplicate last tabler row with form
			$('#mappoints-datatable .travellpress-color-field').wpColorPicker({
            	change: function(event, ui){
            		var hexcolor = $( this ).wpColorPicker( 'color' );
					var markerid = $(this).parents('tr').data('markerid');
					arrMarkers[markerid].setIcon(new L.icon(iconColor(hexcolor)))
				}
            })
			marker = new L.Marker(map_elements.getCenter(), {
                draggable:true,
                title:"This a new marker!",
              	icon: new L.icon(iconColor('#000')),
            });
            marker.id = lastmarkerid;
            marker.addTo(map_elements);
            arrMarkers[lastmarkerid] = marker;

            marker.on('dragend', function(evt){
	       		$("table#mappoints-datatable tr:eq("+this.id+") .point-lat").val(this.getLatLng().lat);
	       		$("table#mappoints-datatable tr:eq("+this.id+") .point-long").val(this.getLatLng().lng);
				//geocodePosition(this.getPosition(), this);
            });
		})


       	function geocodePosition(pos,marker) {
		  geocoder.geocode({
		    latLng: pos
		  }, function(responses) {
		    if (responses && responses.length > 0) {
		      marker.formatted_address = responses[0].formatted_address;
		    } else {
		      marker.formatted_address = 'Cannot determine address at this location.';
		    }
		    $("table#mappoints-datatable tr:eq("+marker.id+") .address-search").val(marker.formatted_address);
		  });
		}

		$('#mappoints-datatable .travellpress-color-field').on('focus', function(){
            $(this).wpColorPicker({
            	change: function(event, ui){
            		var hexcolor = $( this ).wpColorPicker( 'color' );
					var markerid = $(this).parents('tr').data('markerid');
					arrMarkers[markerid].setIcon(new L.icon(iconColor(hexcolor)))
				}
            })

        });

		$("#mappoints-datatable").on("click",'.linkto', function(e) {
			e.preventDefault();
			var markerid = $(this).parent().parent().data('markerid');
			var position = arrMarkers[markerid].getPosition()
	        map_elements.panTo(position);
	        map_elements.setZoom(6);
	    });

	    $("#mappoints-datatable").on("click", '.delete', function(e) {
			e.preventDefault();
			if (confirm("Are you sure you wish to remove this section? This cannot be undone.")) {
				var id = $(this).parents('tr').data('markerid');
			    arrMarkers[id].remove();
			    $(this).parents('tr').remove();
			}
	    });

	    $("#mappoints-datatable tbody").sortable({handle: ".move"});

		/************
		*** eof Markers
		************/

		/************
		*** Polygons
		************/
/*
		$("#mappolygons_addnew").on("click", function(e){
			e.preventDefault();
			$(this).hide();
			$("table.polygone-clone .mappolygons_stop").show();
			var lastid = $("table#mappolygons-datatable tr:last").data("polyid");
			if(!lastid) { lastid = 0; }
			lastid = parseInt(lastid);
			lastid++;
			$("table.polygone-clone tr:first").clone().appendTo("table#mappolygons-datatable");
			$("table#mappolygons-datatable tr:last").data('polyid',lastid)
			$('#mappolygons-datatable .travellpress-color-field').wpColorPicker({
				change: function(event, ui){
                		var hexcolor = $( this ).wpColorPicker( 'color' );
						var polygoneid = $(this).parents('tr').data('polyid');
						arrPolygons[polygoneid].setOptions({fillColor: hexcolor});
					}
			});
			poly = new google.maps.Polygon({
		      	strokeWeight: 3,
			    fillColor: '#5555FF',
		    });

		    arrPolygons[lastid] = poly;
		    poly.setMap(map_elements);
		    poly.setPaths(new google.maps.MVCArray([path]));
			listenerHandle  = google.maps.event.addListener(map_elements, 'click', addPolygonPoint);
		});

		$("#mappolygons-datatable").on("click", '.mappolygons_stop', function(e) {
			e.preventDefault();
			$(this).hide();
			$("#mappolygons_addnew").show();
			$(this).parent().find('.edit_this').show();
			google.maps.event.removeListener(listenerHandle);
        	var encodeString = google.maps.geometry.encoding.encodePath(path);
			$("table#mappolygons-datatable tr:last .encoded").val(encodeString);

		    for( var p=0; p<polymarkers.length; p++){
		        polymarkers[p].setMap(null);
		    }
        	polymarkers = [];
        	poly = '';
        	path = '';
        	path = new google.maps.MVCArray;

		});
		function addPolygonPoint(event) {
		    path.insertAt(path.length, event.latLng);

		    var polymarker = new google.maps.Marker({
			      position: event.latLng,
			      map: map_elements,
			      draggable: true
		    });
		    polymarkers.push(polymarker);
		    polymarker.setTitle("#" + path.length);

		    google.maps.event.addListener(polymarker, 'click', function() {
		      polymarker.setMap(null);
		      for (var i = 0, I = polymarkers.length; i < I && polymarkers[i] != polymarker; ++i);
		      polymarkers.splice(i, 1);
		      path.removeAt(i);
		      }
		    );

		    google.maps.event.addListener(polymarker, 'dragend', function() {
		      for (var i = 0, I = polymarkers.length; i < I && polymarkers[i] != polymarker; ++i);
		      path.setAt(i, polymarker.getPosition());
		      }
		    );
		}

		$('#mappolygons-datatable .travellpress-color-field').on('focus', function(){
                var parent = $(this).parent();
                $(this).wpColorPicker({
                	change: function(event, ui){
                		var hexcolor = $( this ).wpColorPicker( 'color' );
						var polygoneid = $(this).parents('tr').data('polyid');
						arrPolygons[polygoneid].setOptions({
							fillColor: hexcolor,
							strokeColor: hexcolor,
						});

					}
                })
                parent.find('.wp-color-result').click();
        });


		$("#mappolygons-datatable").on("click", ".linkto", function(e) {
			e.preventDefault();
			var id = $(this).parent().parent().data('polyid');
	        var bounds = new google.maps.LatLngBounds();
		    var points = arrPolygons[id].getPath().getArray();
		    for (var n = 0; n < points.length ; n++){
		        bounds.extend(points[n]);
		    }
		    map_elements.fitBounds(bounds);
	    });

	    $("#mappolygons-datatable").on("click", '.delete', function(e) {
			e.preventDefault();
			if (confirm("Are you sure you wish to remove this section? This cannot be undone.")) {
				var id = $(this).parents('tr').data('polyid');
			    arrPolygons[id].setMap(null);
			    $(this).parents('tr').remove();
			}
	    });

	    $("#mappolygons-datatable").on("click", '.edit_this', function(e) {
				e.preventDefault();
				$(this).hide();
				$(this).parent().find('.stop_edit_this').show();
				var id = $(this).parents('tr').data('polyid');
				arrPolygons[id].setEditable(true)

	    });

	    $("#mappolygons-datatable").on("click", '.stop_edit_this', function(e) {
			$(this).hide();
			$(this).parent().find('.edit_this').show();
			e.preventDefault();
			var id = $(this).parents('tr').data('polyid');
        	var encodeString = google.maps.geometry.encoding.encodePath(arrPolygons[id].getPath());
			$(this).parents('tr').find(".encoded").val(encodeString);
			arrPolygons[id].setEditable(false)
  			 for( var p=0; p<polymarkers.length; p++){
		        polymarkers[p].setMap(null);
		    }
        	polymarkers = [];
        	poly = '';
        	path = '';
        	path = new google.maps.MVCArray;
       	});
*/

		/************
		*** eof polygons
		************/

		/************
		*** polylines
        ************/
/*
		$("#mappolylines_addnew").on("click", function(e){
			$(this).hide();
			$("table.polyline-clone .mappolylines_stop").show();
			e.preventDefault();
			var lastid = $("table#mappolylines-datatable tr:last").data("polyid");
			if(!lastid) { lastid = 0; }
			lastid = parseInt(lastid);
			lastid++;
			$("table.polyline-clone tr:first").clone().appendTo("table#mappolylines-datatable").data('polyid',lastid);
			$('#mappolylines-datatable .travellpress-color-field').wpColorPicker({
				change: function(event, ui){
                		var hexcolor = $( this ).wpColorPicker( 'color' );
						var polylineid = $(this).parents('tr').data('polyid');
						arrPolylines[polylineid].setOptions({strokeColor: hexcolor});

					}
			});

			poly = new google.maps.Polyline({
		      	strokeColor: '#000000',
			    strokeOpacity: 1.0,
			    strokeWeight: 3,

		    });
			arrPolylines[lastid] = poly;
		    poly.setMap(map_elements);
			listenerHandle  = google.maps.event.addListener(map_elements, 'click', addPolylinePoint);

		});
 		$("#mappolylines-datatable").on("click", '.mappolylines_stop', function(e) {
			$(this).hide();
			$("#mappolylines_addnew").show();
			$(".edit_this").show();
			e.preventDefault();
			google.maps.event.removeListener(listenerHandle);
        	var encodeString = google.maps.geometry.encoding.encodePath(poly.getPath());

			$("table#mappolylines-datatable tr:last .encoded").val(encodeString);
  			for( var p=0; p<polylinemarkers.length; p++){
		        polylinemarkers[p].setMap(null);
		    }
		   	polylinemarkers = [];
        	poly = '';
        	path = '';
        	path = new google.maps.MVCArray;
       	});


		function addPolylinePoint(event) {

		  	var path = poly.getPath();
			path.push(event.latLng);

			// Add a new marker at the new plotted point on the polyline.
			var polylinemarker = new google.maps.Marker({
				position: event.latLng,
				title: '#' + path.getLength(),
				map: map_elements,
				draggable: true
			});
			polylinemarkers.push(polylinemarker);

			google.maps.event.addListener(polylinemarker, 'click', function() {
				polylinemarker.setMap(null);
				for (var i = 0, I = polylinemarkers.length; i < I && polylinemarkers[i] != polylinemarker; ++i);
				polylinemarkers.splice(i, 1);
				path.removeAt(i);
			});

			google.maps.event.addListener(polylinemarker, 'dragend', function() {
				for (var i = 0, I = polylinemarkers.length; i < I && polylinemarkers[i] != polylinemarker; ++i);
				path.setAt(i, polylinemarker.getPosition());
			});
		}

		$('#mappolylines-datatable .travellpress-color-field').on('focus', function(){
                var parent = $(this).parent();
                $(this).wpColorPicker({
                	change: function(event, ui){
                		var hexcolor = $( this ).wpColorPicker( 'color' );
						var polylineid = $(this).parents('tr').data('polyid');
						arrPolylines[polylineid].setOptions({strokeColor: hexcolor});

					}
                })
                parent.find('.wp-color-result').click();
        });

		$("#mappolylines-datatable").on("click", '.linkto', function(e) {
			e.preventDefault();
				var id = $(this).parent().parent().data('polyid');
		        var bounds = new google.maps.LatLngBounds();
			    var points = arrPolylines[id].getPath().getArray();
			    for (var n = 0; n < points.length ; n++){
			        bounds.extend(points[n]);
			    }
			    map_elements.fitBounds(bounds);
		 });

	    $("#mappolylines-datatable").on("click", '.delete', function(e) {
			e.preventDefault();
			if (confirm("Are you sure you wish to remove this section? This cannot be undone.")) {
				var id = $(this).parents('tr').data('polyid');
				arrPolylines[id].setMap(null);
			    $(this).parents('tr').remove();
			}
	    });
	    $("#mappolylines-datatable").on("click", '.edit_this', function(e) {
				e.preventDefault();
				$(this).hide();
				$(this).parent().find('.stop_edit_this').show();
				var id = $(this).parents('tr').data('polyid');
				arrPolylines[id].setEditable(true)

	    });

	    $("#mappolylines-datatable").on("click", '.stop_edit_this', function(e) {
			$(this).hide();
			$(this).parent().find('.edit_this').show();
			e.preventDefault();
			var id = $(this).parents('tr').data('polyid');
        	var encodeString = google.maps.geometry.encoding.encodePath(arrPolylines[id].getPath());
        	arrPolylines[id].setEditable(false);
			$(this).parents('tr').find(".encoded").val(encodeString);
  			for( var p=0; p<polylinemarkers.length; p++){
		        polylinemarkers[p].setMap(null);
		    }
		   	polylinemarkers = [];
        	poly = '';
        	path = '';
        	path = new google.maps.MVCArray;
       	});
*/
		/************
		*** eof polylines
		************/

		/************
		*** kml
        ************/
/*
		$("#mapkml_addnew").on("click", function(e){
			e.preventDefault();
			var lastid = $("table#mapkml-datatable tr:last").data("kmlid");
			lastid = parseInt(lastid);
			lastid++;
			//$(polyclone).appendTo("table#mappolylines-datatable").data('polyid',lastid);
			$("table.kml-clone tr:first").clone().appendTo("table#mapkml-datatable").data('kmlid',lastid);
		});

	    $("#mapkml-datatable").on("click", '.delete', function(e) {
			e.preventDefault();
			if (confirm("Are you sure you wish to remove this section? This cannot be undone.")) {
				var id = $(this).parents('tr').data('kmlid');
			    $(this).parents('tr').remove();
			}
        });
*/
		/************
		*** eof kml
		************/


		/************
		*** custom center point
		************/
		$('.center_map_point').on("click", function(e){
			$("html, body").animate({ scrollTop: $("#map-elements").offset().top }, "slow");
			e.preventDefault();
			if($(this).val()){
				var pos = $(this).val();
				var latlngStr = pos.replace('(','').split(",",2);
				var lat = parseFloat(latlngStr[0]);
				var lng = parseFloat(latlngStr[1]);
				pos = new L.LatLng(lat, lng);
			} else {
				var pos = map_elements.getCenter();
			}
			marker = new L.Marker(pos, {
                draggable:true,
                title:"Drag me to set map center",
              	icon: new L.icon(iconColor('#FF00FB'))
            });
            marker.addTo(map_elements);

			marker.on('dragend', function(evt){
            	$('.center_map_point').val(this.getLatLng());
            });
		})

		$('.clear_center_map_point').on("click", function(e){
			e.preventDefault();
			$('.center_map_point').val("");
		})

		/************
		*** eof custom center point
		************/

		//helpers

/*
        if (!google.maps.Polygon.prototype.getBounds) {
 			google.maps.Polygon.prototype.getBounds=function(){
			    var bounds = new google.maps.LatLngBounds()
			    this.getPath().forEach(function(element,index){bounds.extend(element)})
			    return bounds
			}
        }
*/

		function moveMarker( marker, position ) {
		    marker.setPosition( position );
		};

		function runGeocode(){
            /*
			$(".address-search").geocomplete({types: ["cities", "addresses", "intersection", "political", "country", "administrative_area_level_1", "administrative_area_level_2", "administrative_area_level_3", "colloquial_area", "locality", "sublocality", "neighborhood", "premise", "subpremise", "postal_code", "natural_feature", "airport", "park", "point_of_interest"]})
			.bind("geocode:result", function(event, result){
		  	var loc = result.geometry.location,
	            lat = loc.lat(),
	            lng = loc.lng();
	  		    $(this).parents('td').find('.point-lat').val(lat);
	  			$(this).parents('td').find('.point-long').val(lng);
	  			var id = $(this).parents('.address').data('markerid');
	  			moveMarker(arrMarkers[id],loc)
	  			map_elements.panTo(loc);
          });
          */
		}

		function clone(obj){
	      if(obj == null || typeof(obj) != 'object') return obj;
	      var temp = new obj.constructor();
	      for(var key in obj) temp[key] = clone(obj[key]);
	      return temp;
		}



		$(".tp-map-table").on('click','.toggle:not(.active)',function(e){
			e.preventDefault();
			$(this).parents('tr').find('.tp-foldable').slideDown();
			$(this).parents('tr').find('.mce-edit-area').trigger( "click" );
			$(this).removeClass('dashicons-arrow-right').addClass('dashicons-arrow-down active')
		});
		$(".tp-map-table").on('click','.toggle.active',function(e){
			e.preventDefault();
			$(this).parents('tr').find('.tp-foldable').slideUp();
			$(this).removeClass('dashicons-arrow-down active').addClass('dashicons-arrow-right')
		});

		 // Set all variables to be used in scope




	  // ADD IMAGE LINK
	  $('#map-details-tabs').on( 'click', '.upload-point-image', function( event ){
	  	var frame;
	    var imgContainer = $(this).parents('.tp-foldable').find( '.point-img-container'),
	    imgIdInput = $(this).parents('.tp-foldable').find( '.point-img-id' ),
	    delImgLink = $(this).parents('.tp-foldable').find( '.delete-point-image'),
	    to = $(this);
	    event.preventDefault();

	    // If the media frame already exists, reopen it.
	    if ( frame ) {
	      frame.open();
	      return;
	    }

	    // Create a new media frame
	    frame = wp.media({
	      title: 'Select or Upload Media Of Your Chosen Persuasion',
	      button: {
	        text: 'Use this media'
	      },
	      multiple: false  // Set to true to allow multiple files to be selected
	    });


	    // When an image is selected in the media frame...
	    frame.on( 'select', function() {

	      // Get media attachment details from the frame state
	      var attachment = frame.state().get('selection').first().toJSON();

	      // Send the attachment URL to our custom image input field.
	      imgContainer.html( '<img src="'+attachment.url+'" alt="" />' );

	      // Send the attachment id to our hidden input
	      imgIdInput.val( attachment.id );

	      // Hide the add image link
	      to.addClass( 'hidden' );

	      // Unhide the remove image link
	      delImgLink.removeClass( 'hidden' );

	    });

	   /* frame.on('close',function() {
		    imgContainer = "";
		});*/

	    // Finally, open the modal on click
	    frame.open();

	  });


	  // DELETE IMAGE LINK
	  $('#map-details-tabs').on( 'click', '.delete-point-image',function( event ){
	  	var imgContainer = $(this).parents('.tp-foldable').find( '.point-img-container'),
	    imgIdInput = $(this).parents('.tp-foldable').find( '.point-img-id' ),
	    delImgLink = $(this).parents('.tp-foldable').find( '.delete-point-image' ),
	    addImgLink = $(this).parents('.tp-foldable').find('.upload-point-image');
	    event.preventDefault();

	    // Clear out the preview image
	    imgContainer.html( '' );

	    // Un-hide the add image link
	    addImgLink.removeClass( 'hidden' );

	    // Hide the delete image link
	    delImgLink.addClass( 'hidden' );

	    // Delete the image id from the hidden input
	    imgIdInput.val( '' );

	  });


	$('#map-details-tabs').on( 'click', '.upload-point-kml', function( event ){
	  	var frame;
	    var urlInput = $(this).parents('.url').find( '.regular-text' );
	    event.preventDefault();

	    // If the media frame already exists, reopen it.
	    if ( frame ) {
	      frame.open();
	      return;
	    }

	    // Create a new media frame
	    frame = wp.media({
	      title: 'Select or Upload Media Of Your Chosen Persuasion',
	      button: {
	        text: 'Use this media'
	      },
	      multiple: false  // Set to true to allow multiple files to be selected
	    });

	    // When an image is selected in the media frame...
	    frame.on( 'select', function() {

	      // Get media attachment details from the frame state
	      var attachment = frame.state().get('selection').first().toJSON();
	      // Send the attachment id to our hidden input
	      urlInput.val( attachment.url );

	    });

	   /* frame.on('close',function() {
		    imgContainer = "";
		});*/

	    // Finally, open the modal on click
	    frame.open();

	  });

		/*********************************/
		/* Main map point related code*/
		/*********************************/
		var mainmarker;
		function initialize_mainmap() {
			//geocoder = new google.maps.Geocoder();
			map_main = L.map(document.getElementById('main-point-map'), {
				  zoom: 10,
				  center: new L.LatLng(mpPoint.lat ,mpPoint.lng),
				  layers: new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
			});

			var marker = new L.Marker([mpPoint.lat ,mpPoint.lng], {
		      	title: 'Main Marker',
		      	draggable:true,
			  	icon: new L.icon(mpPoint.icon_image ? mpPoint.icon_image : iconColor(mpPoint.color))
            });
            marker.addTo(map_main);

		  	mainmarker = marker;

		   	marker.on('dragend', function(evt){
		   		$(".main_point_latitude").val(this.getLatLng().lat);
		   		$(".main_point_longitude").val(this.getLatLng().lng);

                /*
				geocoder.geocode({
				    latLng: this.getPosition()
				  }, function(responses) {
				    if (responses && responses.length > 0) {
				      marker.formatted_address = responses[0].formatted_address;
				    } else {
				      marker.formatted_address = 'Cannot determine address at this location.';
				    }
				    $(".main_point_address").val(marker.formatted_address);
                  });
                */
               });

			//add infoboxes

		   /* google.maps.event.addListener(marker, 'click', function(evt){
		    	 ib.setOptions(boxOptions);
		         boxText.innerHTML = this.ibcontent;
		         ib.open(map_elements, this);
		         currentInfobox = this.id;

		    });*/
		}

        /*
		$(".main_point_address").geocomplete().bind("geocode:result", function(event, result){
		  	var loc = result.geometry.location,
		        lat = loc.lat(),
		        lng = loc.lng();
			    $(this).parents('#main-point-form').find('.main_point_latitude').val(lat);
				$(this).parents('#main-point-form').find('.main_point_longitude').val(lng);
				moveMarker(mainmarker,loc);
				map_main.panTo(loc);
          });
        */

		$('#main-point-form .travellpress-color-field').wpColorPicker({
			change: function(event, ui){
				var hexcolor = $( this ).wpColorPicker( 'color' );

				mainmarker.setIcon(new L.icon(iconColor(hexcolor)))
			}
		})
		if($('body').hasClass('post-php') || $('body').hasClass('post-new-php')){
            L.DomEvent.on(window, 'load', initialize_mainmap);
		}

		$('#main-point-form').on( 'click', '.main-upload-point-image', function( event ){
	  	var frame;
	    var imgContainer = $( '.main-point-img-container'),
	    imgIdInput = $('.main-point-img-id' ),
	    delImgLink = $( '.main-delete-point-image'),
	    to = $(this);
	    event.preventDefault();

	    // If the media frame already exists, reopen it.
	    if ( frame ) {
	      frame.open();
	      return;
	    }

	    // Create a new media frame
	    frame = wp.media({
	      title: 'Select or Upload Media Of Your Chosen Persuasion',
	      button: {
	        text: 'Use this media'
	      },
	      multiple: false  // Set to true to allow multiple files to be selected
	    });


	    // When an image is selected in the media frame...
	    frame.on( 'select', function() {

	      // Get media attachment details from the frame state
	      var attachment = frame.state().get('selection').first().toJSON();

	      // Send the attachment URL to our custom image input field.
	      imgContainer.html( '<img src="'+attachment.url+'" alt="" />' );

	      // Send the attachment id to our hidden input
	      imgIdInput.val( attachment.id );

	      // Hide the add image link
	      to.addClass( 'hidden' );

	      // Unhide the remove image link
	      delImgLink.removeClass( 'hidden' );

	    });

	   /* frame.on('close',function() {
		    imgContainer = "";
		});*/

	    // Finally, open the modal on click
	    frame.open();

	  });

	  // DELETE IMAGE LINK
	  $('#main-point-form').on( 'click', '.main-delete-point-image',function( event ){
	  	var imgContainer = $( '.main-point-img-container'),
	    imgIdInput = $('.main-point-img-id' ),
	    delImgLink = $( '.main-delete-point-image'),
	    addImgLink = $('.main-upload-point-image');
	    event.preventDefault();

	    // Clear out the preview image
	    imgContainer.html( '' );

	    // Un-hide the add image link
	    addImgLink.removeClass( 'hidden' );

	    // Hide the delete image link
	    delImgLink.addClass( 'hidden' );

	    // Delete the image id from the hidden input
	    imgIdInput.val( '' );

	  });


	  /*eof*/

	});
}(jQuery));
