// ==UserScript==
// @id             iitc-plugin-s2-l17-cells@setup
// @name           IITC plugin: S2 L17 Cells
// @category       Layer
// @version        0.0.1.20190115.21337
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://github.com/piczkaczu/iitc-s2-cells/blob/master/iitc-s2-l17-cells.user.js
// @downloadURL    https://github.com/piczkaczu/iitc-s2-cells/blob/master/iitc-s2-l17-cells.meta.js
// @description    [iitc-20190115.21337] Draw level 17 cells and highlight these that already have Pokestop or Gym
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==

var L; // to prevent script errors on load
var $; // to prevent script errors on load
var map; // to prevent script errors on load

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
  plugin_info.buildName = 'iitc';
  plugin_info.dateTimeVersion = '20190115.21337';
  plugin_info.pluginId = 's2l17cells';
  // PLUGIN START ///////////////////////////////////////////////////////

  // use own namespace for plugin
  window.plugin.occupied17cells = function() {};      
  window.plugin.occupied17cells.cellLevel = 17;  
  window.plugin.occupied17cells.layerlist = {};	
  window.plugin.occupied17cells.cellOptionsOccupied = {fill: true, color: 'orange', fillColor:'orange', opacity: 0.3, weight: 1, fillOpacity:0.20, clickable: false };
  window.plugin.occupied17cells.cellOptionsEmpty = {fill: false, color: 'white', opacity: 0.3, weight: 1, clickable: false };
  
  window.plugin.occupied17cells.update = function() {		    
     if (!window.map.hasLayer(window.plugin.occupied17cells.cellsLayer) && !window.map.hasLayer(window.plugin.occupied17cells.occupiedCellsLayer))
     return;
                          
    if (window.map.hasLayer(window.plugin.occupied17cells.cellsLayer)) {
        window.plugin.occupied17cells.cellsLayer.clearLayers();      
     	  window.plugin.s2celldrawer.drawCellList(window.plugin.occupied17cells.cellsLayer, window.plugin.occupied17cells.cellLevel, window.plugin.occupied17cells.cellOptionsEmpty);  
    }              	       
    
    if (window.map.hasLayer(window.plugin.occupied17cells.occupiedCellsLayer)) {
			window.plugin.occupied17cells.occupiedCellsLayer.clearLayers();    
		if (map.getZoom() > 14) {				
			window.plugin.s2celldrawer.drawCellList(window.plugin.occupied17cells.occupiedCellsLayer, window.plugin.occupied17cells.cellLevel, window.plugin.occupied17cells.cellOptionsOccupied, window.plugin.occupied17cells.getPortalsPerCellCount, "plugin-occupied17cells-name");  
		}
    }              	       
  };             
  
  window.plugin.occupied17cells.getPortalsPerCellCount = function(cell) {     
  	var countPerCell = 0;
  	var cellCorners = cell.getCornerLatLngs();
  	var cellPolygon = new google.maps.Polygon({paths: cellCorners}); 
    
  	$.each(window.portals, function(i, portal) {
    	  if (portal != undefined) {        
  	  	  var portalLatLng = portal.getLatLng(); 
    	  	if (cellPolygon.containsLatLng(portalLatLng)) {
         		countPerCell++;          
        	}
   			}
  	}); 
    
    var result = {};
    result.Show = false;    
    if (countPerCell > 0) {
      result.Show = true;
      result.Value = countPerCell;
    }       
  	
    return result;
}
  
  window.plugin.occupied17cells.setSelected = function(a) {        
    if (a.display) {
      var selectedLayer = window.plugin.occupied17cells.layerlist[a.name];      
      if (selectedLayer !== undefined) {
      	if (!window.map.hasLayer(selectedLayer)) {
        	  window.map.addLayer(selectedLayer);
      	}      
      	if (window.map.hasLayer(selectedLayer)) {
        	 window.plugin.occupied17cells.update();
      	}
      }      
    }
  }   
  
          window.plugin.occupied17cells.setLayerState = function() {
       var label = $(".leaflet-control-layers-overlays label span:contains('L17 - Pokémon Full Cells')").parent();
       if (map.getZoom() > 14) {
           label.removeClass('disabled').attr('title', '');
       } else {
           window.plugin.occupied17cells.occupiedCellsLayer.clearLayers();
           label.addClass('disabled').attr('title', 'Zoom in to show those.');
       }
		}
 
var setup = function() {   
  	if (window.plugin.s2celldrawer === undefined) {
       alert('S2 Cells plugin is required for: L17 Cells');
       return;
    }  	 	 
  
     $("<style>")
    .prop("type", "text/css")
    .html(".plugin-occupied17cells-name {\
      font-size: 14px;\
      font-weight: bold;\
      color: gold;\
      opacity: 0.7;\
      text-align: center;\
      text-shadow: -1px -1px #000, 1px -1px #000, -1px 1px #000, 1px 1px #000, 0 0 2px #000; \
      pointer-events: none;\
	  display: none;\
    }")
    .appendTo("head");         
    
    window.plugin.occupied17cells.cellsLayer = new L.LayerGroup();      	      
    window.plugin.occupied17cells.occupiedCellsLayer = new L.LayerGroup();      	
    
    window.addLayerGroup('L17 - Pokémon Cells', window.plugin.occupied17cells.cellsLayer, false);                 	
    window.plugin.occupied17cells.layerlist['L17 - Pokémon Cells'] =  window.plugin.occupied17cells.cellsLayer;  
    window.addLayerGroup('L17 - Pokémon full Cells', window.plugin.occupied17cells.occupiedCellsLayer, true);                 	
    window.plugin.occupied17cells.layerlist['L17 - Pokémon Full Cells'] =  window.plugin.occupied17cells.occupiedCellsLayer;
    window.addHook('mapDataRefreshEnd', window.plugin.occupied17cells.update);    
  
    window.pluginCreateHook('displayedLayerUpdated');
    window.addHook('displayedLayerUpdated',  window.plugin.occupied17cells.setSelected);
	map.on('zoomend', function() { window.plugin.occupied17cells.setLayerState(); });
}
   
// PLUGIN END //////////////////////////////////////////////////////////
setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
}
// wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);