(function ( $ ) {
	"use strict";

	$(function () {

		var poly,geocoder,map_main,map_elements,marker,currentInfobox,listenerHandle;
		var markers = [];
		var polymarkers = [];
		var polylinemarkers = [];

	    var mapCenter = new google.maps.LatLng(54.19265, 16.1779);

		var path = new google.maps.MVCArray;

		var ib = new InfoBox();

		var boxText = document.createElement("div");
		boxText.className = 'map-box';
		
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

      	function iconColor(color) {
		    return {
		        path: 'M19.9,0c-0.2,0-1.6,0-1.8,0C8.8,0.6,1.4,8.2,1.4,17.8c0,1.4,0.2,3.1,0.5,4.2c-0.1-0.1,0.5,1.9,0.8,2.6c0.4,1,0.7,2.1,1.2,3 c2,3.6,6.2,9.7,14.6,18.5c0.2,0.2,0.4,0.5,0.6,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0.2-0.2,0.4-0.5,0.6-0.7c8.4-8.7,12.5-14.8,14.6-18.5 c0.5-0.9,0.9-2,1.3-3c0.3-0.7,0.9-2.6,0.8-2.5c0.3-1.1,0.5-2.7,0.5-4.1C36.7,8.4,29.3,0.6,19.9,0z M2.2,22.9 C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,3,25.2,2.2,22.9z M19.1,26.8c-5.2,0-9.4-4.2-9.4-9.4 s4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4S24.3,26.8,19.1,26.8z M36,22.9C35.2,25.2,36,22.9,36,22.9C36,22.9,36,22.9,36,22.9 C36,22.9,36,22.9,36,22.9z M13.8,17.3a5.3,5.3 0 1,0 10.6,0a5.3,5.3 0 1,0 -10.6,0',
				strokeOpacity: 0,
				strokeWeight: 1,
				fillColor: color,
				fillOpacity: 1,
				rotation: 0,
				scale: 1.1,
				anchor: new google.maps.Point(19,52)
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
                console.log(markers);

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

	    	geocoder = new google.maps.Geocoder();
			
			if(centerPoint) {
				var latlngStr = centerPoint.replace('(','').split(",",2);
				var lat = parseFloat(latlngStr[0]);
				var lng = parseFloat(latlngStr[1]);
				var center = new google.maps.LatLng(lat, lng);
			} else {
				var center = new google.maps.LatLng(-33.92, 151.25);
			}

			map_elements = new google.maps.Map(document.getElementById('map-elements'), {
			  zoom: 10,
			  center: center,
			  mapTypeId: google.maps.MapTypeId.ROADMAP,
			  //styles: [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}],
			});

			if(locations) {
	            var bounds = new google.maps.LatLngBounds();
	        // add markers to map_elements

	            for (var key in markers) {
				    var data = markers[key];
				  
				    var marker = new google.maps.Marker({
				        position: new google.maps.LatLng (data['lat'], data['lng']),
				        map: map_elements,
				        draggable:true,
		                title:"This a "+data['id']+" marker!",
		              	icon: iconColor(data['icon']), //TODO change to object
		              	id: data['id'],
		              	ibcontent: data['data'],
				    });
			      	if(data['image_icon']){
				  		marker.setIcon(data['image_icon']);
				  	}

				
				    arrMarkers[data['id']] = marker;
				    //extend the bounds to include each marker's position
				   
			       	google.maps.event.addListener(marker, 'dragend', function(evt){
			       		$("table#mappoints-datatable tr:eq("+this.id+") .point-lat").val(evt.latLng.lat());
			       		$("table#mappoints-datatable tr:eq("+this.id+") .point-long").val(evt.latLng.lng());
						geocodePosition(this.getPosition(), this);
			       	});
					bounds.extend(marker.position);

					//add infoboxes
 
			        google.maps.event.addListener(marker, 'click', function(evt){
			        	ib.setOptions(boxOptions);
			            boxText.innerHTML = this.ibcontent;
			            ib.open(map_elements, this);
			            currentInfobox = this.id;

			            google.maps.event.addListener(ib,'domready',function(){
				              $('.infoBox-close').click(function() {
				                  ib.close();
				              });
			            });
  
			        });

				} //eof for/ adding markers

				//now fit the map to the newly inclusive bounds
				if(!centerPoint) { 
					map_elements.fitBounds(bounds);
				}
				var listener = google.maps.event.addListener(map_elements, "idle", function () {
				    map_elements.setZoom(3);
				    google.maps.event.removeListener(listener);
				});

				//drag markers
	        } //eof locations
				
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
		} //eof initialize
		var map =  document.getElementById('map-elements');
    	if (typeof(map) != 'undefined' && map != null) {
        google.maps.event.addDomListener(window, 'load', initialize);
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
					arrMarkers[markerid].setIcon(iconColor(hexcolor))
				}
            })
			marker = new google.maps.Marker({
                position: map_elements.getCenter(),
                map: map_elements,
                draggable:true,
                animation: google.maps.Animation.DROP,
                title:"This a new marker!",
              	icon: iconColor('#000'),
              	id: lastmarkerid
            });
            arrMarkers[lastmarkerid] = marker;
			
            google.maps.event.addListener(marker, 'dragend', function(evt){
            	console.log(this.id);
	       		$("table#mappoints-datatable tr:eq("+this.id+") .point-lat").val(evt.latLng.lat());
	       		$("table#mappoints-datatable tr:eq("+this.id+") .point-long").val(evt.latLng.lng());
				geocodePosition(this.getPosition(), this);
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
					arrMarkers[markerid].setIcon(iconColor(hexcolor))
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
			    arrMarkers[id].setMap(null);
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


		/************
		*** eof polygons
		************/

		/************
		*** polylines
		************/
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
	   
		/************
		*** eof polylines
		************/

		/************
		*** kml
		************/
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
				pos = new google.maps.LatLng(lat, lng);
			} else {
				var pos = map_elements.getCenter();
			}
			marker = new google.maps.Marker({
                position: pos,
                map: map_elements,
                draggable:true,
                animation: google.maps.Animation.DROP,
                title:"Drag me to set map center",
              	icon: iconColor('#FF00FB'),
            });
			google.maps.event.addListener(marker, 'dragend', function(evt){
            	
            	$('.center_map_point').val(evt.latLng);
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
		
        if (!google.maps.Polygon.prototype.getBounds) {
 			google.maps.Polygon.prototype.getBounds=function(){
			    var bounds = new google.maps.LatLngBounds()
			    this.getPath().forEach(function(element,index){bounds.extend(element)})
			    return bounds
			}
		}

		function moveMarker( marker, position ) {
		    marker.setPosition( position );
		};

		function runGeocode(){
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
			geocoder = new google.maps.Geocoder();
			map_main = new google.maps.Map(document.getElementById('main-point-map'), {
				  zoom: 10,
				  center: new google.maps.LatLng(mpPoint.lat ,mpPoint.lng),
				  mapTypeId: google.maps.MapTypeId.ROADMAP,
				  //styles: [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}],
			});

			var marker = new google.maps.Marker({
		      	position: new google.maps.LatLng(mpPoint.lat ,mpPoint.lng),
		      	map: map_main,
		      	title: 'Main Marker',
		      	draggable:true,
			  	icon: iconColor(mpPoint.color), //TODO change to object
		  	});
		  	if(mpPoint.icon_image){
		  		marker.setIcon(mpPoint.icon_image);
		  	}

		  	mainmarker = marker;

		   	google.maps.event.addListener(marker, 'dragend', function(evt){
		   		$(".main_point_latitude").val(evt.latLng.lat());
		   		$(".main_point_longitude").val(evt.latLng.lng());
				
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
		   	});

			//add infoboxes

		   /* google.maps.event.addListener(marker, 'click', function(evt){
		    	 ib.setOptions(boxOptions);
		         boxText.innerHTML = this.ibcontent;
		         ib.open(map_elements, this);
		         currentInfobox = this.id;

		    });*/
		}

		$(".main_point_address").geocomplete().bind("geocode:result", function(event, result){
		  	var loc = result.geometry.location,
		        lat = loc.lat(),
		        lng = loc.lng();
			    $(this).parents('#main-point-form').find('.main_point_latitude').val(lat);
				$(this).parents('#main-point-form').find('.main_point_longitude').val(lng);
				moveMarker(mainmarker,loc);
				map_main.panTo(loc);
		  });	

		$('#main-point-form .travellpress-color-field').wpColorPicker({
			change: function(event, ui){
				var hexcolor = $( this ).wpColorPicker( 'color' );
				
				mainmarker.setIcon(iconColor(hexcolor))
			}
		})
		if($('body').hasClass('post-php') || $('body').hasClass('post-new-php')){
			google.maps.event.addDomListener(window, 'load', initialize_mainmap);
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


/**
 * jQuery Geocoding and Places Autocomplete Plugin - V 1.7.0
 *
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2016
 * @author Ubilabs http://ubilabs.net, 2016
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function($,window,document,undefined){var defaults={bounds:true,country:null,map:false,details:false,detailsAttribute:"name",detailsScope:null,autoselect:true,location:false,mapOptions:{zoom:14,scrollwheel:false,mapTypeId:"roadmap"},markerOptions:{draggable:false},maxZoom:16,types:["geocode"],blur:false,geocodeAfterResult:false,restoreValueAfterBlur:false};var componentTypes=("street_address route intersection political "+"country administrative_area_level_1 administrative_area_level_2 "+"administrative_area_level_3 colloquial_area locality sublocality "+"neighborhood premise subpremise postal_code natural_feature airport "+"park point_of_interest post_box street_number floor room "+"lat lng viewport location "+"formatted_address location_type bounds").split(" ");var placesDetails=("id place_id url website vicinity reference name rating "+"international_phone_number icon formatted_phone_number").split(" ");function GeoComplete(input,options){this.options=$.extend(true,{},defaults,options);if(options&&options.types){this.options.types=options.types}this.input=input;this.$input=$(input);this._defaults=defaults;this._name="geocomplete";this.init()}$.extend(GeoComplete.prototype,{init:function(){this.initMap();this.initMarker();this.initGeocoder();this.initDetails();this.initLocation()},initMap:function(){if(!this.options.map){return}if(typeof this.options.map.setCenter=="function"){this.map=this.options.map;return}this.map=new google.maps.Map($(this.options.map)[0],this.options.mapOptions);google.maps.event.addListener(this.map,"click",$.proxy(this.mapClicked,this));google.maps.event.addListener(this.map,"dragend",$.proxy(this.mapDragged,this));google.maps.event.addListener(this.map,"idle",$.proxy(this.mapIdle,this));google.maps.event.addListener(this.map,"zoom_changed",$.proxy(this.mapZoomed,this))},initMarker:function(){if(!this.map){return}var options=$.extend(this.options.markerOptions,{map:this.map});if(options.disabled){return}this.marker=new google.maps.Marker(options);google.maps.event.addListener(this.marker,"dragend",$.proxy(this.markerDragged,this))},initGeocoder:function(){var selected=false;var options={types:this.options.types,bounds:this.options.bounds===true?null:this.options.bounds,componentRestrictions:this.options.componentRestrictions};if(this.options.country){options.componentRestrictions={country:this.options.country}}this.autocomplete=new google.maps.places.Autocomplete(this.input,options);this.geocoder=new google.maps.Geocoder;if(this.map&&this.options.bounds===true){this.autocomplete.bindTo("bounds",this.map)}google.maps.event.addListener(this.autocomplete,"place_changed",$.proxy(this.placeChanged,this));this.$input.on("keypress."+this._name,function(event){if(event.keyCode===13){return false}});if(this.options.geocodeAfterResult===true){this.$input.bind("keypress."+this._name,$.proxy(function(){if(event.keyCode!=9&&this.selected===true){this.selected=false}},this))}this.$input.bind("geocode."+this._name,$.proxy(function(){this.find()},this));this.$input.bind("geocode:result."+this._name,$.proxy(function(){this.lastInputVal=this.$input.val()},this));if(this.options.blur===true){this.$input.on("blur."+this._name,$.proxy(function(){if(this.options.geocodeAfterResult===true&&this.selected===true){return}if(this.options.restoreValueAfterBlur===true&&this.selected===true){setTimeout($.proxy(this.restoreLastValue,this),0)}else{this.find()}},this))}},initDetails:function(){if(!this.options.details){return}if(this.options.detailsScope){var $details=$(this.input).parents(this.options.detailsScope).find(this.options.details)}else{var $details=$(this.options.details)}var attribute=this.options.detailsAttribute,details={};function setDetail(value){details[value]=$details.find("["+attribute+"="+value+"]")}$.each(componentTypes,function(index,key){setDetail(key);setDetail(key+"_short")});$.each(placesDetails,function(index,key){setDetail(key)});this.$details=$details;this.details=details},initLocation:function(){var location=this.options.location,latLng;if(!location){return}if(typeof location=="string"){this.find(location);return}if(location instanceof Array){latLng=new google.maps.LatLng(location[0],location[1])}if(location instanceof google.maps.LatLng){latLng=location}if(latLng){if(this.map){this.map.setCenter(latLng)}if(this.marker){this.marker.setPosition(latLng)}}},destroy:function(){if(this.map){google.maps.event.clearInstanceListeners(this.map);google.maps.event.clearInstanceListeners(this.marker)}this.autocomplete.unbindAll();google.maps.event.clearInstanceListeners(this.autocomplete);google.maps.event.clearInstanceListeners(this.input);this.$input.removeData();this.$input.off(this._name);this.$input.unbind("."+this._name)},find:function(address){this.geocode({address:address||this.$input.val()})},geocode:function(request){if(!request.address){return}if(this.options.bounds&&!request.bounds){if(this.options.bounds===true){request.bounds=this.map&&this.map.getBounds()}else{request.bounds=this.options.bounds}}if(this.options.country){request.region=this.options.country}this.geocoder.geocode(request,$.proxy(this.handleGeocode,this))},selectFirstResult:function(){var selected="";if($(".pac-item-selected")[0]){selected="-selected"}var $span1=$(".pac-container:visible .pac-item"+selected+":first span:nth-child(2)").text();var $span2=$(".pac-container:visible .pac-item"+selected+":first span:nth-child(3)").text();var firstResult=$span1;if($span2){firstResult+=" - "+$span2}this.$input.val(firstResult);return firstResult},restoreLastValue:function(){if(this.lastInputVal){this.$input.val(this.lastInputVal)}},handleGeocode:function(results,status){if(status===google.maps.GeocoderStatus.OK){var result=results[0];this.$input.val(result.formatted_address);this.update(result);if(results.length>1){this.trigger("geocode:multiple",results)}}else{this.trigger("geocode:error",status)}},trigger:function(event,argument){this.$input.trigger(event,[argument])},center:function(geometry){if(geometry.viewport){this.map.fitBounds(geometry.viewport);if(this.map.getZoom()>this.options.maxZoom){this.map.setZoom(this.options.maxZoom)}}else{this.map.setZoom(this.options.maxZoom);this.map.setCenter(geometry.location)}if(this.marker){this.marker.setPosition(geometry.location);this.marker.setAnimation(this.options.markerOptions.animation)}},update:function(result){if(this.map){this.center(result.geometry)}if(this.$details){this.fillDetails(result)}this.trigger("geocode:result",result)},fillDetails:function(result){var data={},geometry=result.geometry,viewport=geometry.viewport,bounds=geometry.bounds;$.each(result.address_components,function(index,object){var name=object.types[0];$.each(object.types,function(index,name){data[name]=object.long_name;data[name+"_short"]=object.short_name})});$.each(placesDetails,function(index,key){data[key]=result[key]});$.extend(data,{formatted_address:result.formatted_address,location_type:geometry.location_type||"PLACES",viewport:viewport,bounds:bounds,location:geometry.location,lat:geometry.location.lat(),lng:geometry.location.lng()});$.each(this.details,$.proxy(function(key,$detail){var value=data[key];this.setDetail($detail,value)},this));this.data=data},setDetail:function($element,value){if(value===undefined){value=""}else if(typeof value.toUrlValue=="function"){value=value.toUrlValue()}if($element.is(":input")){$element.val(value)}else{$element.text(value)}},markerDragged:function(event){this.trigger("geocode:dragged",event.latLng)},mapClicked:function(event){this.trigger("geocode:click",event.latLng)},mapDragged:function(event){this.trigger("geocode:mapdragged",this.map.getCenter())},mapIdle:function(event){this.trigger("geocode:idle",this.map.getCenter())},mapZoomed:function(event){this.trigger("geocode:zoom",this.map.getZoom())},resetMarker:function(){this.marker.setPosition(this.data.location);this.setDetail(this.details.lat,this.data.location.lat());this.setDetail(this.details.lng,this.data.location.lng())},placeChanged:function(){var place=this.autocomplete.getPlace();this.selected=true;if(!place.geometry){if(this.options.autoselect){var autoSelection=this.selectFirstResult();this.find(autoSelection)}}else{this.update(place)}}});$.fn.geocomplete=function(options){var attribute="plugin_geocomplete";if(typeof options=="string"){var instance=$(this).data(attribute)||$(this).geocomplete().data(attribute),prop=instance[options];if(typeof prop=="function"){prop.apply(instance,Array.prototype.slice.call(arguments,1));return $(this)}else{if(arguments.length==2){prop=arguments[1]}return prop}}else{return this.each(function(){var instance=$.data(this,attribute);if(!instance){instance=new GeoComplete(this,options);$.data(this,attribute,instance)}})}}})(jQuery,window,document);

//infobox_packed.js
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('7 8(a){a=a||{};r.s.1R.2k(2,3d);2.Q=a.1v||"";2.1H=a.1B||J;2.S=a.1G||0;2.H=a.1z||1h r.s.1Y(0,0);2.B=a.U||1h r.s.2E(0,0);2.15=a.13||t;2.1p=a.1t||"2h";2.1m=a.F||{};2.1E=a.1C||"3g";2.P=a.1j||"3b://38.r.33/2Y/2T/2N/1r.2K";3(a.1j===""){2.P=""}2.1f=a.1x||1h r.s.1Y(1,1);3(q a.A==="p"){3(q a.18==="p"){a.A=L}v{a.A=!a.18}}2.w=!a.A;2.17=a.1n||J;2.1I=a.2g||"2e";2.16=a.1l||J;2.4=t;2.z=t;2.14=t;2.V=t;2.E=t;2.R=t}8.9=1h r.s.1R();8.9.25=7(){5 i;5 f;5 a;5 d=2;5 c=7(e){e.20=L;3(e.1i){e.1i()}};5 b=7(e){e.30=J;3(e.1Z){e.1Z()}3(!d.16){c(e)}};3(!2.4){2.4=1e.2S("2Q");2.1d();3(q 2.Q.1u==="p"){2.4.O=2.G()+2.Q}v{2.4.O=2.G();2.4.1a(2.Q)}2.2J()[2.1I].1a(2.4);2.1w();3(2.4.6.D){2.R=L}v{3(2.S!==0&&2.4.Z>2.S){2.4.6.D=2.S;2.4.6.2D="2A";2.R=L}v{a=2.1P();2.4.6.D=(2.4.Z-a.W-a.11)+"12";2.R=J}}2.1F(2.1H);3(!2.16){2.E=[];f=["2t","1O","2q","2p","1M","2o","2n","2m","2l"];1o(i=0;i<f.1L;i++){2.E.1K(r.s.u.19(2.4,f[i],c))}2.E.1K(r.s.u.19(2.4,"1O",7(e){2.6.1J="2j"}))}2.V=r.s.u.19(2.4,"2i",b);r.s.u.T(2,"2f")}};8.9.G=7(){5 a="";3(2.P!==""){a="<2d";a+=" 2c=\'"+2.P+"\'";a+=" 2b=11";a+=" 6=\'";a+=" U: 2a;";a+=" 1J: 29;";a+=" 28: "+2.1E+";";a+="\'>"}K a};8.9.1w=7(){5 a;3(2.P!==""){a=2.4.3n;2.z=r.s.u.19(a,"1M",2.27())}v{2.z=t}};8.9.27=7(){5 a=2;K 7(e){e.20=L;3(e.1i){e.1i()}r.s.u.T(a,"3m");a.1r()}};8.9.1F=7(d){5 m;5 n;5 e=0,I=0;3(!d){m=2.1D();3(m 3l r.s.3k){3(!m.26().3h(2.B)){m.3f(2.B)}n=m.26();5 a=m.3e();5 h=a.Z;5 f=a.24;5 k=2.H.D;5 l=2.H.1k;5 g=2.4.Z;5 b=2.4.24;5 i=2.1f.D;5 j=2.1f.1k;5 o=2.23().3c(2.B);3(o.x<(-k+i)){e=o.x+k-i}v 3((o.x+g+k+i)>h){e=o.x+g+k+i-h}3(2.17){3(o.y<(-l+j+b)){I=o.y+l-j-b}v 3((o.y+l+j)>f){I=o.y+l+j-f}}v{3(o.y<(-l+j)){I=o.y+l-j}v 3((o.y+b+l+j)>f){I=o.y+b+l+j-f}}3(!(e===0&&I===0)){5 c=m.3a();m.39(e,I)}}}};8.9.1d=7(){5 i,F;3(2.4){2.4.37=2.1p;2.4.6.36="";F=2.1m;1o(i 35 F){3(F.34(i)){2.4.6[i]=F[i]}}2.4.6.32="31(0)";3(q 2.4.6.X!=="p"&&2.4.6.X!==""){2.4.6.2Z="\\"2X:2W.2V.2U(2R="+(2.4.6.X*1X)+")\\"";2.4.6.2P="2O(X="+(2.4.6.X*1X)+")"}2.4.6.U="2M";2.4.6.M=\'1c\';3(2.15!==t){2.4.6.13=2.15}}};8.9.1P=7(){5 c;5 a={1b:0,1g:0,W:0,11:0};5 b=2.4;3(1e.1s&&1e.1s.1W){c=b.2L.1s.1W(b,"");3(c){a.1b=C(c.1V,10)||0;a.1g=C(c.1U,10)||0;a.W=C(c.1T,10)||0;a.11=C(c.1S,10)||0}}v 3(1e.2I.N){3(b.N){a.1b=C(b.N.1V,10)||0;a.1g=C(b.N.1U,10)||0;a.W=C(b.N.1T,10)||0;a.11=C(b.N.1S,10)||0}}K a};8.9.2H=7(){3(2.4){2.4.2G.2F(2.4);2.4=t}};8.9.1y=7(){2.25();5 a=2.23().2C(2.B);2.4.6.W=(a.x+2.H.D)+"12";3(2.17){2.4.6.1g=-(a.y+2.H.1k)+"12"}v{2.4.6.1b=(a.y+2.H.1k)+"12"}3(2.w){2.4.6.M="1c"}v{2.4.6.M="A"}};8.9.2B=7(a){3(q a.1t!=="p"){2.1p=a.1t;2.1d()}3(q a.F!=="p"){2.1m=a.F;2.1d()}3(q a.1v!=="p"){2.1Q(a.1v)}3(q a.1B!=="p"){2.1H=a.1B}3(q a.1G!=="p"){2.S=a.1G}3(q a.1z!=="p"){2.H=a.1z}3(q a.1n!=="p"){2.17=a.1n}3(q a.U!=="p"){2.1q(a.U)}3(q a.13!=="p"){2.22(a.13)}3(q a.1C!=="p"){2.1E=a.1C}3(q a.1j!=="p"){2.P=a.1j}3(q a.1x!=="p"){2.1f=a.1x}3(q a.18!=="p"){2.w=a.18}3(q a.A!=="p"){2.w=!a.A}3(q a.1l!=="p"){2.16=a.1l}3(2.4){2.1y()}};8.9.1Q=7(a){2.Q=a;3(2.4){3(2.z){r.s.u.Y(2.z);2.z=t}3(!2.R){2.4.6.D=""}3(q a.1u==="p"){2.4.O=2.G()+a}v{2.4.O=2.G();2.4.1a(a)}3(!2.R){2.4.6.D=2.4.Z+"12";3(q a.1u==="p"){2.4.O=2.G()+a}v{2.4.O=2.G();2.4.1a(a)}}2.1w()}r.s.u.T(2,"2z")};8.9.1q=7(a){2.B=a;3(2.4){2.1y()}r.s.u.T(2,"21")};8.9.22=7(a){2.15=a;3(2.4){2.4.6.13=a}r.s.u.T(2,"2y")};8.9.2x=7(a){2.w=!a;3(2.4){2.4.6.M=(2.w?"1c":"A")}};8.9.2w=7(){K 2.Q};8.9.1A=7(){K 2.B};8.9.2v=7(){K 2.15};8.9.2u=7(){5 a;3((q 2.1D()==="p")||(2.1D()===t)){a=J}v{a=!2.w}K a};8.9.3i=7(){2.w=J;3(2.4){2.4.6.M="A"}};8.9.3j=7(){2.w=L;3(2.4){2.4.6.M="1c"}};8.9.2s=7(c,b){5 a=2;3(b){2.B=b.1A();2.14=r.s.u.2r(b,"21",7(){a.1q(2.1A())})}2.1N(c);3(2.4){2.1F()}};8.9.1r=7(){5 i;3(2.z){r.s.u.Y(2.z);2.z=t}3(2.E){1o(i=0;i<2.E.1L;i++){r.s.u.Y(2.E[i])}2.E=t}3(2.14){r.s.u.Y(2.14);2.14=t}3(2.V){r.s.u.Y(2.V);2.V=t}2.1N(t)};',62,210,'||this|if|div_|var|style|function|InfoBox|prototype||||||||||||||||undefined|typeof|google|maps|null|event|else|isHidden_|||closeListener_|visible|position_|parseInt|width|eventListeners_|boxStyle|getCloseBoxImg_|pixelOffset_|yOffset|false|return|true|visibility|currentStyle|innerHTML|closeBoxURL_|content_|fixedWidthSet_|maxWidth_|trigger|position|contextListener_|left|opacity|removeListener|offsetWidth||right|px|zIndex|moveListener_|zIndex_|enableEventPropagation_|alignBottom_|isHidden|addDomListener|appendChild|top|hidden|setBoxStyle_|document|infoBoxClearance_|bottom|new|stopPropagation|closeBoxURL|height|enableEventPropagation|boxStyle_|alignBottom|for|boxClass_|setPosition|close|defaultView|boxClass|nodeType|content|addClickHandler_|infoBoxClearance|draw|pixelOffset|getPosition|disableAutoPan|closeBoxMargin|getMap|closeBoxMargin_|panBox_|maxWidth|disableAutoPan_|pane_|cursor|push|length|click|setMap|mouseover|getBoxWidths_|setContent|OverlayView|borderRightWidth|borderLeftWidth|borderBottomWidth|borderTopWidth|getComputedStyle|100|Size|preventDefault|cancelBubble|position_changed|setZIndex|getProjection|offsetHeight|createInfoBoxDiv_|getBounds|getCloseClickHandler_|margin|pointer|relative|align|src|img|floatPane|domready|pane|infoBox|contextmenu|default|apply|touchmove|touchend|touchstart|dblclick|mouseup|mouseout|addListener|open|mousedown|getVisible|getZIndex|getContent|setVisible|zindex_changed|content_changed|auto|setOptions|fromLatLngToDivPixel|overflow|LatLng|removeChild|parentNode|onRemove|documentElement|getPanes|gif|ownerDocument|absolute|mapfiles|alpha|filter|div|Opacity|createElement|en_us|Alpha|Microsoft|DXImageTransform|progid|intl|MsFilter|returnValue|translateZ|WebkitTransform|com|hasOwnProperty|in|cssText|className|www|panBy|getCenter|http|fromLatLngToContainerPixel|arguments|getDiv|setCenter|2px|contains|show|hide|Map|instanceof|closeclick|firstChild'.split('|'),0,{}))