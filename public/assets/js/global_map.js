(function ( $ ) {
  "use strict";

  $(function () {

    var map, i, markerCluster;
    var markers = [];
    var arrMarkers = [];

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
      pixelOffset: new L.Point(-60, -5),
      zIndex: null,
        boxStyle: { 
        width: parseFloat(travellerpress_general_settings.infobox_width)+"px"
      },
      closeBoxMargin: "0",
      closeBoxURL: "",
      infoBoxClearance: new L.Point(1, 1),
      isHidden: false,
      pane: "floatPane",
      enableEventPropagation: false,
        };
    // Place your public-facing JavaScript here
    
    function iconColor(color) {
        var s = travellerpress_general_settings.scale;
        return {
            iconUrl: encodeURI("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='37' height='47'><path d='M19.9,0c-0.2,0-1.6,0-1.8,0C8.8,0.6,1.4,8.2,1.4,17.8c0,1.4,0.2,3.1,0.5,4.2c-0.1-0.1,0.5,1.9,0.8,2.6c0.4,1,0.7,2.1,1.2,3 c2,3.6,6.2,9.7,14.6,18.5c0.2,0.2,0.4,0.5,0.6,0.7c0,0,0,0,0,0c0,0,0,0,0,0c0.2-0.2,0.4-0.5,0.6-0.7c8.4-8.7,12.5-14.8,14.6-18.5 c0.5-0.9,0.9-2,1.3-3c0.3-0.7,0.9-2.6,0.8-2.5c0.3-1.1,0.5-2.7,0.5-4.1C36.7,8.4,29.3,0.6,19.9,0z M2.2,22.9 C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,2.2,22.9,2.2,22.9C2.2,22.9,3,25.2,2.2,22.9z M19.1,26.8c-5.2,0-9.4-4.2-9.4-9.4 s4.2-9.4,9.4-9.4c5.2,0,9.4,4.2,9.4,9.4S24.3,26.8,19.1,26.8z M36,22.9C35.2,25.2,36,22.9,36,22.9C36,22.9,36,22.9,36,22.9 C36,22.9,36,22.9,36,22.9z M13.8,17.3a5.3,5.3 0 1,0 10.6,0a5.3,5.3 0 1,0 -10.6,0' fill='" + color + "'/></svg>").replace('#','%23'),
            iconSize: new L.Point(37*s,48*s),
            iconAnchor: new L.Point(19*s,52*s)
       };
    }

    if(travellerpress_settings.centerPoint) {
      var latlngStr = travellerpress_settings.centerPoint.replace('(','').split(",",2);
      var lat = parseFloat(latlngStr[0]);
      var lng = parseFloat(latlngStr[1]);
      var center = new L.LatLng(lat, lng);
    } else {
      var center = new L.LatLng(47.5, 19.05);
    }

    if(wpv.mapstyle){
      var mapstyle = JSON.parse(wpv.mapstyle.style);
    } else {
      var mapstyle = [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}];
    }

    if(wpv.mapzoom === 'auto') {
      var set_zoom = 10;
    } else {
      var set_zoom = parseInt(wpv.mapzoom);
    }
    var maptype = wpv.maptype;

      function initialize() {

      map = new L.map("map", {
        zoom: set_zoom,
        center: center,
        /*
          zoomControl: true,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.LEFT_CENTER
          },
        */
          layers: new L.TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png")
      });

      var bounds = new L.LatLngBounds();

          for (var key in globalmap) {
          var data = globalmap[key];
          
          var marker_content;
          if(data['ismerged'] ==="yes") {
            marker_content = '<h2>'+travellerpress_general_settings.group_text+'</h2><ul class="post-series-links">'+data['ibmergecontent']+'</ul><div class="infoBox-close"><i class="fa fa-times"></i></div>';
          } else {
            marker_content = data['ibcontent'];
          }

          var marker = new L.Marker([data['lat'], data['lng']], {
              icon: new L.icon(iconColor(data['color'])),
              id: data['id'],
              ibcontent: marker_content,
          });
          marker.addTo(map);
/*
          if(data['icon_image']){
            marker.setIcon(data['icon_image']);
          }
*/
/*
          
          arrMarkers[data['id']] = marker;
          //extend the bounds to include each marker's position
         
        bounds.extend(marker.position);

        //add infoboxes

            google.maps.event.addDomListener(marker, 'click', (function(marker, i) {
              return function() {
                ib.close();
                ib.setOptions(boxOptions);
                boxText.innerHTML = this.ibcontent;
               
                ib.open(map, this);
                currentInfobox = this.id;
                var latLng = this.getPosition();
                map.panTo(latLng);
                map.panBy(90,-185);

                google.maps.event.addListener(ib,'domready',function(){
                  $('.infoBox-close').click(function() {
                      ib.close();
                  });
                });

              }
            })(marker, i));

            google.maps.event.addListener(map, "click", function(event) {
                 ib.close();
            });
              

        
            google.maps.event.addDomListener(window, "resize", function() {
          var center = map.getCenter();
          google.maps.event.trigger(map, "resize");
          map.setCenter(center); 
            });

*/  


      } //eof for/ adding markers

/*
      if(globalmap_elements.polygons) {
            for (var key in globalmap_elements.polygons) {
              var data = globalmap_elements.polygons[key];
              
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
          
          if(data['data'] || data['title']) {
            google.maps.event.addListener(polygon, 'click', function() {
                ib.setOptions(boxOptions);
                    boxText.innerHTML = this.ibcontent;
                    ib.setPosition(this.getBounds().getCenter());
                    ib.close();
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
*/
/*
          if(globalmap_elements.polylines) {
            for (var key in globalmap_elements.polylines) {
              var data = globalmap_elements.polylines[key];

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
          

          if(data['data'] || data['title']) {
                google.maps.event.addListener(polyline, 'click', function() {
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
                    ib.close();
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
          } //eof polylines
*/

      if(globalmap_elements.kml) {
            for (var key in globalmap_elements.kml) {
              var data = globalmap_elements.kml[key];
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
            
        

          if(wpv.mapzoom != 'auto') {
            if(travellerpress_settings.centerPoint) { 

            } else {
              //map.setCenter(bounds.getCenter());
            }
          map.setZoom(parseInt(wpv.mapzoom));
        } else {
          if(travellerpress_settings.centerPoint) {
              
            } else {
              //map.fitBounds(bounds);
            }
           
        }
      if(travellerpress_settings.automarker === '1') {
            //google.maps.event.trigger(arrMarkers[0],'click');
      }

    } //eof initialize

      initialize();
      /*
        google.maps.event.addDomListener(window, 'load', initialize);

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

function InfoBox(a) {}

/*
function InfoBox(a)
	{
	a=a||
		{
	};
	google.maps.OverlayView.apply(this,arguments);
	this.content_=a.content||"";
	this.disableAutoPan_=a.disableAutoPan||false;
	this.maxWidth_=a.maxWidth||0;
	this.pixelOffset_=a.pixelOffset||new google.maps.Size(0,0);
	this.position_=a.position||new google.maps.LatLng(0,0);
	this.zIndex_=a.zIndex||null;
	this.boxClass_=a.boxClass||"infoBox";
	this.boxStyle_=a.boxStyle||
		{
	};
	this.closeBoxMargin_=a.closeBoxMargin||"2px";
	this.closeBoxURL_=a.closeBoxURL||"http://www.google.com/intl/en_us/mapfiles/close.gif";
	if(a.closeBoxURL==="")
		{
		this.closeBoxURL_=""
	}
	this.infoBoxClearance_=a.infoBoxClearance||new google.maps.Size(1,1);
	if(typeof a.visible==="undefined")
		{
		if(typeof a.isHidden==="undefined")
			{
			a.visible=true
		}
		else
			{
			a.visible=!a.isHidden
		}
	}
	this.isHidden_=!a.visible;
	this.alignBottom_=a.alignBottom||false;
	this.pane_=a.pane||"floatPane";
	this.enableEventPropagation_=a.enableEventPropagation||false;
	this.div_=null;
	this.closeListener_=null;
	this.moveListener_=null;
	this.contextListener_=null;
	this.eventListeners_=null;
	this.fixedWidthSet_=null
}
InfoBox.prototype=new google.maps.OverlayView();
InfoBox.prototype.createInfoBoxDiv_=function()
	{
	var i;
	var f;
	var a;
	var d=this;
	var c=function(e)
		{
		e.cancelBubble=true;
		if(e.stopPropagation)
			{
			e.stopPropagation()
		}
	};
	var b=function(e)
		{
		e.returnValue=false;
		if(e.preventDefault)
			{
			e.preventDefault()
		}
		if(!d.enableEventPropagation_)
			{
			c(e)
		}
	};
	if(!this.div_)
		{
		this.div_=document.createElement("div");
		this.setBoxStyle_();
		if(typeof this.content_.nodeType==="undefined")
			{
			this.div_.innerHTML=this.getCloseBoxImg_()+this.content_
		}
		else
			{
			this.div_.innerHTML=this.getCloseBoxImg_();
			this.div_.appendChild(this.content_)
		}
		this.getPanes()[this.pane_].appendChild(this.div_);
		this.addClickHandler_();
		if(this.div_.style.width)
			{
			this.fixedWidthSet_=true
		}
		else
			{
			if(this.maxWidth_!==0&&this.div_.offsetWidth>this.maxWidth_)
				{
				this.div_.style.width=this.maxWidth_;
				this.div_.style.overflow="auto";
				this.fixedWidthSet_=true
			}
			else
				{
				a=this.getBoxWidths_();
				this.div_.style.width=(this.div_.offsetWidth-a.left-a.right)+"px";
				this.fixedWidthSet_=false
			}
		}
		this.panBox_(this.disableAutoPan_);
		if(!this.enableEventPropagation_)
			{
			this.eventListeners_=[];
			f=["mousedown","mouseover","mouseout","mouseup","click","dblclick","touchstart","touchend","touchmove"];
			for(i=0;
			i<f.length;
			i++)
				{
				this.eventListeners_.push(google.maps.event.addDomListener(this.div_,f[i],c))
			}
			this.eventListeners_.push(google.maps.event.addDomListener(this.div_,"mouseover",function(e)
				{
				this.style.cursor="default"
			}
			))
		}
		this.contextListener_=google.maps.event.addDomListener(this.div_,"contextmenu",b);
		google.maps.event.trigger(this,"domready")
	}
};
InfoBox.prototype.getCloseBoxImg_=function()
	{
	var a="";
	if(this.closeBoxURL_!=="")
		{
		a="<img";
		a+=" src='"+this.closeBoxURL_+"'";
		a+=" align=right";
		a+=" style='";
		a+=" position: relative;";
		a+=" cursor: pointer;";
		a+=" margin: "+this.closeBoxMargin_+";";
		a+="'>"
	}
	return a
};
InfoBox.prototype.addClickHandler_=function()
	{
	var a;
	if(this.closeBoxURL_!=="")
		{
		a=this.div_.firstChild;
		this.closeListener_=google.maps.event.addDomListener(a,"click",this.getCloseClickHandler_())
	}
	else
		{
		this.closeListener_=null
	}
};
InfoBox.prototype.getCloseClickHandler_=function()
	{
	var a=this;
	return function(e)
		{
		e.cancelBubble=true;
		if(e.stopPropagation)
			{
			e.stopPropagation()
		}
		google.maps.event.trigger(a,"closeclick");
		a.close()
	}
};
InfoBox.prototype.panBox_=function(d)
	{
	var m;
	var n;
	var e=0,yOffset=0;
	if(!d)
		{
		m=this.getMap();
		if(m instanceof google.maps.Map)
			{
			if(!m.getBounds().contains(this.position_))
				{
				m.setCenter(this.position_)
			}
			n=m.getBounds();
			var a=m.getDiv();
			var h=a.offsetWidth;
			var f=a.offsetHeight;
			var k=this.pixelOffset_.width;
			var l=this.pixelOffset_.height;
			var g=this.div_.offsetWidth;
			var b=this.div_.offsetHeight;
			var i=this.infoBoxClearance_.width;
			var j=this.infoBoxClearance_.height;
			var o=this.getProjection().fromLatLngToContainerPixel(this.position_);
			if(o.x<(-k+i))
				{
				e=o.x+k-i
			}
			else if((o.x+g+k+i)>h)
				{
				e=o.x+g+k+i-h
			}
			if(this.alignBottom_)
				{
				if(o.y<(-l+j+b))
					{
					yOffset=o.y+l-j-b
				}
				else if((o.y+l+j)>f)
					{
					yOffset=o.y+l+j-f
				}
			}
			else
				{
				if(o.y<(-l+j))
					{
					yOffset=o.y+l-j
				}
				else if((o.y+b+l+j)>f)
					{
					yOffset=o.y+b+l+j-f
				}
			}
			if(!(e===0&&yOffset===0))
				{
				var c=m.getCenter();
				m.panBy(e,yOffset)
			}
		}
	}
};
InfoBox.prototype.setBoxStyle_=function()
	{
	var i,boxStyle;
	if(this.div_)
		{
		this.div_.className=this.boxClass_;
		this.div_.style.cssText="";
		boxStyle=this.boxStyle_;
		for(i in boxStyle)
			{
			if(boxStyle.hasOwnProperty(i))
				{
				this.div_.style[i]=boxStyle[i]
			}
		}
		this.div_.style.WebkitTransform="translateZ(0)";
		if(typeof this.div_.style.opacity!=="undefined"&&this.div_.style.opacity!=="")
			{
			this.div_.style.MsFilter="\"progid:DXImageTransform.Microsoft.Alpha(Opacity="+(this.div_.style.opacity*100)+")\"";
			this.div_.style.filter="alpha(opacity="+(this.div_.style.opacity*100)+")"
		}
		this.div_.style.position="absolute";
		this.div_.style.visibility='hidden';
		if(this.zIndex_!==null)
			{
			this.div_.style.zIndex=this.zIndex_
		}
	}
};
InfoBox.prototype.getBoxWidths_=function()
	{
	var c;
	var a=
		{
		top:0,bottom:0,left:0,right:0
	};
	var b=this.div_;
	if(document.defaultView&&document.defaultView.getComputedStyle)
		{
		c=b.ownerDocument.defaultView.getComputedStyle(b,"");
		if(c)
			{
			a.top=parseInt(c.borderTopWidth,10)||0;
			a.bottom=parseInt(c.borderBottomWidth,10)||0;
			a.left=parseInt(c.borderLeftWidth,10)||0;
			a.right=parseInt(c.borderRightWidth,10)||0
		}
	}
	else if(document.documentElement.currentStyle)
		{
		if(b.currentStyle)
			{
			a.top=parseInt(b.currentStyle.borderTopWidth,10)||0;
			a.bottom=parseInt(b.currentStyle.borderBottomWidth,10)||0;
			a.left=parseInt(b.currentStyle.borderLeftWidth,10)||0;
			a.right=parseInt(b.currentStyle.borderRightWidth,10)||0
		}
	}
	return a
};
InfoBox.prototype.onRemove=function()
	{
	if(this.div_)
		{
		this.div_.parentNode.removeChild(this.div_);
		this.div_=null
	}
};
InfoBox.prototype.draw=function()
	{
	this.createInfoBoxDiv_();
	var a=this.getProjection().fromLatLngToDivPixel(this.position_);
	this.div_.style.left=(a.x+this.pixelOffset_.width)+"px";
	if(this.alignBottom_)
		{
		this.div_.style.bottom=-(a.y+this.pixelOffset_.height)+"px"
	}
	else
		{
		this.div_.style.top=(a.y+this.pixelOffset_.height)+"px"
	}
	if(this.isHidden_)
		{
		this.div_.style.visibility="hidden"
	}
	else
		{
		this.div_.style.visibility="visible"
	}
};
InfoBox.prototype.setOptions=function(a)
	{
	if(typeof a.boxClass!=="undefined")
		{
		this.boxClass_=a.boxClass;
		this.setBoxStyle_()
	}
	if(typeof a.boxStyle!=="undefined")
		{
		this.boxStyle_=a.boxStyle;
		this.setBoxStyle_()
	}
	if(typeof a.content!=="undefined")
		{
		this.setContent(a.content)
	}
	if(typeof a.disableAutoPan!=="undefined")
		{
		this.disableAutoPan_=a.disableAutoPan
	}
	if(typeof a.maxWidth!=="undefined")
		{
		this.maxWidth_=a.maxWidth
	}
	if(typeof a.pixelOffset!=="undefined")
		{
		this.pixelOffset_=a.pixelOffset
	}
	if(typeof a.alignBottom!=="undefined")
		{
		this.alignBottom_=a.alignBottom
	}
	if(typeof a.position!=="undefined")
		{
		this.setPosition(a.position)
	}
	if(typeof a.zIndex!=="undefined")
		{
		this.setZIndex(a.zIndex)
	}
	if(typeof a.closeBoxMargin!=="undefined")
		{
		this.closeBoxMargin_=a.closeBoxMargin
	}
	if(typeof a.closeBoxURL!=="undefined")
		{
		this.closeBoxURL_=a.closeBoxURL
	}
	if(typeof a.infoBoxClearance!=="undefined")
		{
		this.infoBoxClearance_=a.infoBoxClearance
	}
	if(typeof a.isHidden!=="undefined")
		{
		this.isHidden_=a.isHidden
	}
	if(typeof a.visible!=="undefined")
		{
		this.isHidden_=!a.visible
	}
	if(typeof a.enableEventPropagation!=="undefined")
		{
		this.enableEventPropagation_=a.enableEventPropagation
	}
	if(this.div_)
		{
		this.draw()
	}
};
InfoBox.prototype.setContent=function(a)
	{
	this.content_=a;
	if(this.div_)
		{
		if(this.closeListener_)
			{
			google.maps.event.removeListener(this.closeListener_);
			this.closeListener_=null
		}
		if(!this.fixedWidthSet_)
			{
			this.div_.style.width=""
		}
		if(typeof a.nodeType==="undefined")
			{
			this.div_.innerHTML=this.getCloseBoxImg_()+a
		}
		else
			{
			this.div_.innerHTML=this.getCloseBoxImg_();
			this.div_.appendChild(a)
		}
		if(!this.fixedWidthSet_)
			{
			this.div_.style.width=this.div_.offsetWidth+"px";
			if(typeof a.nodeType==="undefined")
				{
				this.div_.innerHTML=this.getCloseBoxImg_()+a
			}
			else
				{
				this.div_.innerHTML=this.getCloseBoxImg_();
				this.div_.appendChild(a)
			}
		}
		this.addClickHandler_()
	}
	google.maps.event.trigger(this,"content_changed")
};
InfoBox.prototype.setPosition=function(a)
	{
	this.position_=a;
	if(this.div_)
		{
		this.draw()
	}
	google.maps.event.trigger(this,"position_changed")
};
InfoBox.prototype.setZIndex=function(a)
	{
	this.zIndex_=a;
	if(this.div_)
		{
		this.div_.style.zIndex=a
	}
	google.maps.event.trigger(this,"zindex_changed")
};
InfoBox.prototype.setVisible=function(a)
	{
	this.isHidden_=!a;
	if(this.div_)
		{
		this.div_.style.visibility=(this.isHidden_?"hidden":"visible")
	}
};
InfoBox.prototype.getContent=function()
	{
	return this.content_
};
InfoBox.prototype.getPosition=function()
	{
	return this.position_
};
InfoBox.prototype.getZIndex=function()
	{
	return this.zIndex_
};
InfoBox.prototype.getVisible=function()
	{
	var a;
	if((typeof this.getMap()==="undefined")||(this.getMap()===null))
		{
		a=false
	}
	else
		{
		a=!this.isHidden_
	}
	return a
};
InfoBox.prototype.show=function()
	{
	this.isHidden_=false;
	if(this.div_)
		{
		this.div_.style.visibility="visible"
	}
};
InfoBox.prototype.hide=function()
	{
	this.isHidden_=true;
	if(this.div_)
		{
		this.div_.style.visibility="hidden"
	}
};
InfoBox.prototype.open=function(c,b)
	{
	var a=this;
	if(b)
		{
		this.position_=b.getPosition();
		this.moveListener_=google.maps.event.addListener(b,"position_changed",function()
			{
			a.setPosition(this.getPosition())
		}
		)
	}
	this.setMap(c);
	if(this.div_)
		{
		this.panBox_()
	}
};
InfoBox.prototype.close=function()
	{
	var i;
	if(this.closeListener_)
		{
		google.maps.event.removeListener(this.closeListener_);
		this.closeListener_=null
	}
	if(this.eventListeners_)
		{
		for(i=0;
		i<this.eventListeners_.length;
		i++)
			{
			google.maps.event.removeListener(this.eventListeners_[i])
		}
		this.eventListeners_=null
	}
	if(this.moveListener_)
		{
		google.maps.event.removeListener(this.moveListener_);
		this.moveListener_=null
	}
	if(this.contextListener_)
		{
		google.maps.event.removeListener(this.contextListener_);
		this.contextListener_=null
	}
	this.setMap(null)
};
*/

