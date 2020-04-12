(function ( $ ) {
	"use strict";

	$(function () {
	custom_map_ids.forEach(function(id) {
    
	var custom_map = window[id];
		
		var map,i,markerCluster;
		var markers = [];
		var arrMarkers = [];
		var arrPolygons = {};

		var ib = new InfoBox();

	    var boxText = document.createElement("div");
	    boxText.className = 'map-box';

        var currentInfobox;

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
		// Place your public-facing JavaScript here
		
		function iconColor(color) {
		    return {
		        path: 'M19.9,0c-0.2,0-1.6,0-1.8,0C8.8,0.6,1.4,8.2,1.4,17.8c0,1.4,0.2,3.1,0.5,4.2c-0.1-0.1,0.5,1.9,0.8,2.6c0.4,1,0.7,2.1,1.2,3 c2,3.6,6.2,9.7,14.6,18.5c0.2,0.2,0.4,0.5,0.6,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0.2-0.2,0.4-0.5,0.6-0.7c8.4-8.7,12.5-14.8,14.6-18.5 c0.5-0.9,0.9-2,1.3-3c0.3-0.7,0.9-2.6,0.8-2.5c0.3-1.1,0.5-2.7,0.5-4.1C36.7,8.4,29.3,0.6,19.9,0z M2.2,22.9 C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,3,25.2,2.2,22.9z M19.1,26.8c-5.2,0-9.4-4.2-9.4-9.4 s4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4S24.3,26.8,19.1,26.8z M36,22.9C35.2,25.2,36,22.9,36,22.9C36,22.9,36,22.9,36,22.9 C36,22.9,36,22.9,36,22.9z M13.8,17.3a5.3,5.3 0 1,0 10.6,0a5.3,5.3 0 1,0 -10.6,0',
				strokeOpacity: 0,
				strokeWeight: 1,
				fillColor: color,
				fillOpacity: 1,
				rotation: 0,
				scale: parseFloat(travellerpress_general_settings.scale),
				anchor: new google.maps.Point(19,52)
		   };
		}

		if(custom_map.centerPoint) {
			var latlngStr = custom_map.centerPoint.replace('(','').split(",",2);
			var lat = parseFloat(latlngStr[0]);
			var lng = parseFloat(latlngStr[1]);
			var center = new google.maps.LatLng(lat, lng);
		} else {
			var center = new google.maps.LatLng(-33.92, 151.25);
		}
		
		if(custom_map.map_el_style){
			var mapstyle = JSON.parse(custom_map.map_el_style.style);
		} else {
			
			var mapstyle = [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}];
		}
		if(custom_map.map_el_zoom === 'auto') {
			var set_zoom = 10;
		} else {
			var set_zoom = parseInt(custom_map.map_el_zoom);
		}
		var maptype = custom_map.map_el_type;
    	function initialize() {
	
	    	map = new google.maps.Map(document.getElementById(id), {
			  zoom: set_zoom,
			  scrollwheel: false,
			  center: center,
			  mapTypeId: google.maps.MapTypeId[maptype],
			  zoomControl: true,
			  zoomControlOptions: {
			        style: google.maps.ZoomControlStyle.LARGE,
			        position: google.maps.ControlPosition.LEFT_CENTER
			  },
			  styles: mapstyle,
			  //styles: [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}],
			});

			var bounds = new google.maps.LatLngBounds();

			if(custom_map.locations) {
	            var bounds = new google.maps.LatLngBounds();
	        // add markers to map

	            for (var key in custom_map.locations) {

				    var data = custom_map.locations[key];
				     
				    var marker = new google.maps.Marker({
				        position: new google.maps.LatLng (data.pointlat, data.pointlong),
				        map: map,
		                
		              	icon: iconColor(data.icon), //TODO change to object
		              	id: data.id,
		              	ibcontent: data['ibdata'],
				    });
			        if(data.pointicon_image){
				    	marker.setIcon(data.pointicon_image);
				    }


				    arrMarkers[data['id']] = marker;
				    //extend the bounds to include each marker's position
			
					bounds.extend(marker.position);

					//add infoboxes
 					
		            google.maps.event.addListener(marker, 'click', (function(marker, i) {
			          return function() {
			          	 ib.close();
			            ib.setOptions(boxOptions);
			            boxText.innerHTML = this.ibcontent;
			            ib.open(map, this);
			            currentInfobox = this.id;
			            var latLng = this.getPosition();
			            map.panTo(latLng);
			            var winWidth = $(window).width();

			            if( winWidth >= 1470) {
			            	map.panBy(90,5);
			            }
        				if( winWidth > 769 && winWidth < 1470  ) {
			            	map.panBy(90,-25);
			            } 
			            if( winWidth < 768) {
							map.panBy(90,-25);
			            } 

			            google.maps.event.addListener(ib,'domready',function(){
			              $('.infoBox-close').click(function() {
			                  ib.close();
			              });
			            });

			          }
			        })(marker, i));

				} //eof for/ adding markers

				//now fit the map to the newly inclusive bounds
				

 				//drag markers
	        } //eof locations
					
		    if(custom_map.polygons) {
	        	for (var key in custom_map.polygons) {
	        		var data = custom_map.polygons[key];
	        		
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

	        if(custom_map.polylines) {
	        	for (var key in custom_map.polylines) {
	        		var data = custom_map.polylines[key];

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
				        	 ib.close();
					    	ib.setOptions(boxOptions);
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
			if(custom_map.kml) {
	        	for (var key in custom_map.kml) {
	        		var data = custom_map.kml[key];
			        var kmllayer = new google.maps.KmlLayer({
						    url: data['url'],
						    preserveViewport: true,
						  });
					  kmllayer.setMap(map);
					  
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
	        	
	        //map.fitBounds(bounds);
	        if(custom_map.map_el_zoom != 'auto') {
	        	if(custom_map.centerPoint) { 

	        	} else {
	     	    	map.setCenter(bounds.getCenter());
	     	    }
  				map.setZoom(parseInt(custom_map.map_el_zoom));
  			} else {
				if(custom_map.centerPoint) { 
	        		
	        	} else {
  			   		map.fitBounds(bounds);
  			   	}
  			}
			/*if(custom_map.map_el_zoom != 'auto') {
				console.log(set_zoom);
		        var listener = google.maps.event.addListener(map, "idle", function() { 
				if (map.getZoom() > parseInt(custom_map.map_el_zoom)) map.setZoom(parseInt(custom_map.map_el_zoom)); 
				  google.maps.event.removeListener(listener); 
				});
		    }*/
			
			if(custom_map.map_auto_open === 'yes') {
				google.maps.event.trigger(arrMarkers[0],'click');
	    	}
    	  	google.maps.event.addDomListener(window, "resize", function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center); 
	      	});


		} //eof initialize

        $('#prevpoint').click(function(e){
         
	          e.preventDefault();
	          var index = currentInfobox;
	          
	          if (index+1 < arrMarkers.length ) {
	              google.maps.event.trigger(arrMarkers[index+1],'click');
	          } else {
	              google.maps.event.trigger(arrMarkers[0],'click');
	          }
      	})


      	$('#nextpoint').click(function(e){
          e.preventDefault();
          if ( typeof(currentInfobox) == "undefined" ) {
               google.maps.event.trigger(arrMarkers[arrMarkers.length-1],'click');
          } else {
               var index = currentInfobox;
               if(index-1 < 0) {
                  //if index is less than zero than open last marker from array
                 google.maps.event.trigger(arrMarkers[arrMarkers.length-1],'click');
               } else {
                  google.maps.event.trigger(arrMarkers[index-1],'click');
               }
          }

      })
		
        google.maps.event.addDomListener(window, 'load', initialize);
        
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


	});//eof forEach
	});

}(jQuery));

//infobox_packed.js
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('7 8(a){a=a||{};r.s.1R.2k(2,3d);2.Q=a.1v||"";2.1H=a.1B||J;2.S=a.1G||0;2.H=a.1z||1h r.s.1Y(0,0);2.B=a.U||1h r.s.2E(0,0);2.15=a.13||t;2.1p=a.1t||"2h";2.1m=a.F||{};2.1E=a.1C||"3g";2.P=a.1j||"3b://38.r.33/2Y/2T/2N/1r.2K";3(a.1j===""){2.P=""}2.1f=a.1x||1h r.s.1Y(1,1);3(q a.A==="p"){3(q a.18==="p"){a.A=L}v{a.A=!a.18}}2.w=!a.A;2.17=a.1n||J;2.1I=a.2g||"2e";2.16=a.1l||J;2.4=t;2.z=t;2.14=t;2.V=t;2.E=t;2.R=t}8.9=1h r.s.1R();8.9.25=7(){5 i;5 f;5 a;5 d=2;5 c=7(e){e.20=L;3(e.1i){e.1i()}};5 b=7(e){e.30=J;3(e.1Z){e.1Z()}3(!d.16){c(e)}};3(!2.4){2.4=1e.2S("2Q");2.1d();3(q 2.Q.1u==="p"){2.4.O=2.G()+2.Q}v{2.4.O=2.G();2.4.1a(2.Q)}2.2J()[2.1I].1a(2.4);2.1w();3(2.4.6.D){2.R=L}v{3(2.S!==0&&2.4.Z>2.S){2.4.6.D=2.S;2.4.6.2D="2A";2.R=L}v{a=2.1P();2.4.6.D=(2.4.Z-a.W-a.11)+"12";2.R=J}}2.1F(2.1H);3(!2.16){2.E=[];f=["2t","1O","2q","2p","1M","2o","2n","2m","2l"];1o(i=0;i<f.1L;i++){2.E.1K(r.s.u.19(2.4,f[i],c))}2.E.1K(r.s.u.19(2.4,"1O",7(e){2.6.1J="2j"}))}2.V=r.s.u.19(2.4,"2i",b);r.s.u.T(2,"2f")}};8.9.G=7(){5 a="";3(2.P!==""){a="<2d";a+=" 2c=\'"+2.P+"\'";a+=" 2b=11";a+=" 6=\'";a+=" U: 2a;";a+=" 1J: 29;";a+=" 28: "+2.1E+";";a+="\'>"}K a};8.9.1w=7(){5 a;3(2.P!==""){a=2.4.3n;2.z=r.s.u.19(a,"1M",2.27())}v{2.z=t}};8.9.27=7(){5 a=2;K 7(e){e.20=L;3(e.1i){e.1i()}r.s.u.T(a,"3m");a.1r()}};8.9.1F=7(d){5 m;5 n;5 e=0,I=0;3(!d){m=2.1D();3(m 3l r.s.3k){3(!m.26().3h(2.B)){m.3f(2.B)}n=m.26();5 a=m.3e();5 h=a.Z;5 f=a.24;5 k=2.H.D;5 l=2.H.1k;5 g=2.4.Z;5 b=2.4.24;5 i=2.1f.D;5 j=2.1f.1k;5 o=2.23().3c(2.B);3(o.x<(-k+i)){e=o.x+k-i}v 3((o.x+g+k+i)>h){e=o.x+g+k+i-h}3(2.17){3(o.y<(-l+j+b)){I=o.y+l-j-b}v 3((o.y+l+j)>f){I=o.y+l+j-f}}v{3(o.y<(-l+j)){I=o.y+l-j}v 3((o.y+b+l+j)>f){I=o.y+b+l+j-f}}3(!(e===0&&I===0)){5 c=m.3a();m.39(e,I)}}}};8.9.1d=7(){5 i,F;3(2.4){2.4.37=2.1p;2.4.6.36="";F=2.1m;1o(i 35 F){3(F.34(i)){2.4.6[i]=F[i]}}2.4.6.32="31(0)";3(q 2.4.6.X!=="p"&&2.4.6.X!==""){2.4.6.2Z="\\"2X:2W.2V.2U(2R="+(2.4.6.X*1X)+")\\"";2.4.6.2P="2O(X="+(2.4.6.X*1X)+")"}2.4.6.U="2M";2.4.6.M=\'1c\';3(2.15!==t){2.4.6.13=2.15}}};8.9.1P=7(){5 c;5 a={1b:0,1g:0,W:0,11:0};5 b=2.4;3(1e.1s&&1e.1s.1W){c=b.2L.1s.1W(b,"");3(c){a.1b=C(c.1V,10)||0;a.1g=C(c.1U,10)||0;a.W=C(c.1T,10)||0;a.11=C(c.1S,10)||0}}v 3(1e.2I.N){3(b.N){a.1b=C(b.N.1V,10)||0;a.1g=C(b.N.1U,10)||0;a.W=C(b.N.1T,10)||0;a.11=C(b.N.1S,10)||0}}K a};8.9.2H=7(){3(2.4){2.4.2G.2F(2.4);2.4=t}};8.9.1y=7(){2.25();5 a=2.23().2C(2.B);2.4.6.W=(a.x+2.H.D)+"12";3(2.17){2.4.6.1g=-(a.y+2.H.1k)+"12"}v{2.4.6.1b=(a.y+2.H.1k)+"12"}3(2.w){2.4.6.M="1c"}v{2.4.6.M="A"}};8.9.2B=7(a){3(q a.1t!=="p"){2.1p=a.1t;2.1d()}3(q a.F!=="p"){2.1m=a.F;2.1d()}3(q a.1v!=="p"){2.1Q(a.1v)}3(q a.1B!=="p"){2.1H=a.1B}3(q a.1G!=="p"){2.S=a.1G}3(q a.1z!=="p"){2.H=a.1z}3(q a.1n!=="p"){2.17=a.1n}3(q a.U!=="p"){2.1q(a.U)}3(q a.13!=="p"){2.22(a.13)}3(q a.1C!=="p"){2.1E=a.1C}3(q a.1j!=="p"){2.P=a.1j}3(q a.1x!=="p"){2.1f=a.1x}3(q a.18!=="p"){2.w=a.18}3(q a.A!=="p"){2.w=!a.A}3(q a.1l!=="p"){2.16=a.1l}3(2.4){2.1y()}};8.9.1Q=7(a){2.Q=a;3(2.4){3(2.z){r.s.u.Y(2.z);2.z=t}3(!2.R){2.4.6.D=""}3(q a.1u==="p"){2.4.O=2.G()+a}v{2.4.O=2.G();2.4.1a(a)}3(!2.R){2.4.6.D=2.4.Z+"12";3(q a.1u==="p"){2.4.O=2.G()+a}v{2.4.O=2.G();2.4.1a(a)}}2.1w()}r.s.u.T(2,"2z")};8.9.1q=7(a){2.B=a;3(2.4){2.1y()}r.s.u.T(2,"21")};8.9.22=7(a){2.15=a;3(2.4){2.4.6.13=a}r.s.u.T(2,"2y")};8.9.2x=7(a){2.w=!a;3(2.4){2.4.6.M=(2.w?"1c":"A")}};8.9.2w=7(){K 2.Q};8.9.1A=7(){K 2.B};8.9.2v=7(){K 2.15};8.9.2u=7(){5 a;3((q 2.1D()==="p")||(2.1D()===t)){a=J}v{a=!2.w}K a};8.9.3i=7(){2.w=J;3(2.4){2.4.6.M="A"}};8.9.3j=7(){2.w=L;3(2.4){2.4.6.M="1c"}};8.9.2s=7(c,b){5 a=2;3(b){2.B=b.1A();2.14=r.s.u.2r(b,"21",7(){a.1q(2.1A())})}2.1N(c);3(2.4){2.1F()}};8.9.1r=7(){5 i;3(2.z){r.s.u.Y(2.z);2.z=t}3(2.E){1o(i=0;i<2.E.1L;i++){r.s.u.Y(2.E[i])}2.E=t}3(2.14){r.s.u.Y(2.14);2.14=t}3(2.V){r.s.u.Y(2.V);2.V=t}2.1N(t)};',62,210,'||this|if|div_|var|style|function|InfoBox|prototype||||||||||||||||undefined|typeof|google|maps|null|event|else|isHidden_|||closeListener_|visible|position_|parseInt|width|eventListeners_|boxStyle|getCloseBoxImg_|pixelOffset_|yOffset|false|return|true|visibility|currentStyle|innerHTML|closeBoxURL_|content_|fixedWidthSet_|maxWidth_|trigger|position|contextListener_|left|opacity|removeListener|offsetWidth||right|px|zIndex|moveListener_|zIndex_|enableEventPropagation_|alignBottom_|isHidden|addDomListener|appendChild|top|hidden|setBoxStyle_|document|infoBoxClearance_|bottom|new|stopPropagation|closeBoxURL|height|enableEventPropagation|boxStyle_|alignBottom|for|boxClass_|setPosition|close|defaultView|boxClass|nodeType|content|addClickHandler_|infoBoxClearance|draw|pixelOffset|getPosition|disableAutoPan|closeBoxMargin|getMap|closeBoxMargin_|panBox_|maxWidth|disableAutoPan_|pane_|cursor|push|length|click|setMap|mouseover|getBoxWidths_|setContent|OverlayView|borderRightWidth|borderLeftWidth|borderBottomWidth|borderTopWidth|getComputedStyle|100|Size|preventDefault|cancelBubble|position_changed|setZIndex|getProjection|offsetHeight|createInfoBoxDiv_|getBounds|getCloseClickHandler_|margin|pointer|relative|align|src|img|floatPane|domready|pane|infoBox|contextmenu|default|apply|touchmove|touchend|touchstart|dblclick|mouseup|mouseout|addListener|open|mousedown|getVisible|getZIndex|getContent|setVisible|zindex_changed|content_changed|auto|setOptions|fromLatLngToDivPixel|overflow|LatLng|removeChild|parentNode|onRemove|documentElement|getPanes|gif|ownerDocument|absolute|mapfiles|alpha|filter|div|Opacity|createElement|en_us|Alpha|Microsoft|DXImageTransform|progid|intl|MsFilter|returnValue|translateZ|WebkitTransform|com|hasOwnProperty|in|cssText|className|www|panBy|getCenter|http|fromLatLngToContainerPixel|arguments|getDiv|setCenter|2px|contains|show|hide|Map|instanceof|closeclick|firstChild'.split('|'),0,{}))