$(function() {

    $("#accordion").accordion({
        collapsible: true,
        active: false,
        heightStyle: "content"
    });

    function makeAccordionHeadersTabbable() {
    const accordion = $("#accordion");

    accordion.removeAttr("role");

    accordion.find(".ui-accordion-header")
        .attr({
            "tabindex": "0",
            "role": "button"
        })
       .removeAttr("aria-selected"); 
    accordion.find(".ui-accordion-content")
        .attr("role", "region");
}

    // Initial state
    makeAccordionHeadersTabbable();

    // Restore all headers to the normal Tab sequence
    // whenever an accordion section is opened or closed
    $("#accordion").on("accordionactivate", function() {
        makeAccordionHeadersTabbable();
    });
});

setTimeout(function () {
  const loader = document.getElementById("preloader");
  if (loader) {
    loader.classList.add("fade-out");
  }
}, 3000);

function init() 
{
	// map options
var centerLat = 37.85965671995;
var centerLng = 24.8429740239;		
var initialZoom = 11;

var map = L.map('xartis',{
continuousWorld: false,
center: [centerLat, centerLng],
zoom: initialZoom,
maxZoom:22,
});


// Accessibility helper: announce layer changes to screen readers via live region.
function announceLayerChange(name, action) {
  var announcer = document.getElementById('layer-announcer');
  if (announcer) {
    // Clear then set so the aria-live region re-fires even for the same message.
    announcer.textContent = '';
    setTimeout(function () {
      announcer.textContent = name + ' layer ' + action + '.';
    }, 50);
  }
}
const descriptionButton =
  document.getElementById("read-map-description");

let activeDescriptionId = null;

const layerDescriptions = {
  "Andros 1:150.000": "map-description-150000",
  "Chora 1:5.000": "map-description-5000",
  "Land uses": "map-description-landuse"
};
let readingDescription = false;
descriptionButton.addEventListener("click", function () {
  if (!activeDescriptionId) return;

  const heading = document.getElementById(activeDescriptionId);
  if (!heading) return;

  const panel = heading.closest("#accordion > div");
  if (!panel) return;

  // Open the corresponding accordion section
  const headers = $("#accordion").accordion("option", "header");
  const index = $("#accordion").find(headers).index(panel.previousElementSibling);

  if (index >= 0) {
    $("#accordion").accordion("option", "active", index);
  }

  // Move focus to the map description
  setTimeout(function () {
    panel.style.display = "block";
    heading.setAttribute("tabindex", "-1");
    heading.focus();
    readingDescription = true;
    heading.scrollIntoView({
      block: "start",
      behavior: "auto"
    });
  }, 150);
});
// Return to Layers panel with Escape
document.addEventListener("keydown", function (event) {

  if (event.key !== "Escape" || !readingDescription) {
    return;
  }

  event.preventDefault();

  readingDescription = false;

  descriptionButton.focus();

});

// Layer activation

map.on('overlayadd', function (event) {
  document.querySelectorAll('.layer-info').forEach(div => {
    div.style.display = 'none';
  });

  if (event.name === 'Chora 1:5.000') {
    document.getElementById('info_5000').style.display = 'block';
  }
       if (event.name === 'Andros 1:150.000') {
    document.getElementById('info_150000').style.display = 'block';
  }
     if (event.name === 'Land uses') {
    document.getElementById('info_other').style.display = 'block';
  }

activeDescriptionId = layerDescriptions[event.name] || null;

  descriptionButton.hidden = !activeDescriptionId;

  if (activeDescriptionId) {

    // Place the button immediately after the selected layer
    const layerLabels = document.querySelectorAll(
      ".leaflet-control-layers-overlays label"
    );

    layerLabels.forEach(function (label) {
      const input = label.querySelector('input[type="checkbox"]');

      if (input && input.checked) {
        const labelText = label.textContent.trim();

        if (labelText === event.name) {
          label.after(descriptionButton);
        }
      }
    });

    announceLayerChange(
  event.name,
  "enabled. Map description available. " +
  "Press Tab to reach Read map description, then Enter to open it. " +
  "While reading the description, press Escape to return to the Layers panel."
);

  } else {
    announceLayerChange(event.name, "enabled");
  }
});
map.on('overlayremove', function (event) {

  if (event.name === 'Chora 1:5.000') {
    document.getElementById('info_5000').style.display = 'none';
  }

  if (event.name === 'Andros 1:150.000') {
    document.getElementById('info_150000').style.display = 'none';
  }

  if (event.name === 'Land uses') {
    document.getElementById('info_other').style.display = 'none';
  }

  // Hide the description button when its layer is disabled
  if (layerDescriptions[event.name] === activeDescriptionId) {
    activeDescriptionId = null;
    descriptionButton.hidden = true;
  }

  // Announce layer deactivation to NVDA
  announceLayerChange(event.name, 'disabled');

});

// Announce baselayer changes too
map.on('baselayerchange', function (event) {
  announceLayerChange(event.name, 'selected as basemap');
});

// Layer για τον MiniMap (π.χ. το ίδιο με τον κύριο ή διαφορετικό)
var miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: false
});

// Δημιουργία του MiniMap
var miniMap = new L.Control.MiniMap(miniMapLayer, {
    toggleDisplay: true,
    minimized: false,
    width: 220,
    height: 180,
    aimingRectOptions: {
        color: "#ff1100",  // Κόκκινο πλαίσιο
        weight: 2,
        opacity: 1,
        fillOpacity: 0
    },
    position: 'bottomright'  // Θέση στο κάτω δεξιά
}).addTo(map);

//set basemaps: OSM tiles and ESRI world imagery source
 var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
 osm.addTo(map);

var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
});

// Gray basemap - Esri World Gray Canvas
var grayBasemap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Tiles &copy; Esri',
    maxNativeZoom: 16,
    maxZoom: 22
  }
);

 var lightOSM = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap contributors',
    className: 'light-osm-tiles',
    maxZoom: 19
  }
);

    var ekxa = L.WMS.overlay(
    "http://gis.ktimanet.gr/wms/wmsopen/wmsserver.aspx?",
    {
        layers: 'BASEMAP',
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        crs: L.CRS.EPSG4326,
        attribution: 'Εθνικό Κτηματολόγιο'
    }
);


// define your WMS layergroup  from Geoserver
var landuses = new L.tileLayer.wms("http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms", {
            layers:'w_papachristou:small_scale_landuse',
			transparent:true,
            format: 'image/png',
            tiled: false,
            opacity: 1,
			version: '1.1.0',
             attribution: "",
          
        });

var small_scale = new L.tileLayer.wms("http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms", {
        layers: 'w_papachristou:small_scale_vector',
        transparent: true,
        format: 'image/png',
        tiled: false,
        opacity: 1,
        version: '1.1.0',
        attribution: "",

    });

 var annot = new L.tileLayer.wms("http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms", {
        layers: 'w_papachristou:annotations',
        transparent: true,
        format: 'image/png',
        tiled: false,
        opacity: 1,
        version: '1.1.0',
        attribution: "",

    });

 var large_scale = new L.tileLayer.wms("http://atlas.geocenter.survey.ntua.gr:8080/geoserver/wms", {
        layers: 'w_papachristou:large_scale',
        transparent: true,
        format: 'image/png',
        tiled: false,
        opacity: 1,
        version: '1.1.0',
        attribution: "",

    });
	
// Ορισμός bounding box
    var bbox = [[37.83600, 24.93180], [37.83980, 24.94480]]; // [southWest, northEast]

map.on('overlayadd', function(e) {
  if (e.layer === large_scale) {
    map.fitBounds(bbox); // zoom στο bounding box
  }
  if (e.layer === small_scale) {
    map.setView([37.85965671995, 24.8429740239], 11); // αρχικό extent
  }
  if (e.layer === landuses) {
    map.setView([37.85965671995, 24.8429740239], 11); // αρχικό extent
  }
});


// Add controls

var baseMaps={
  " OpenStreetMap ": osm,
  " Light OpenStreetMap": lightOSM,
  " Esri World Gray Canvas": grayBasemap,
  " Esri Imagery" : esri
};

var overlays = {
    "Andros 1:150.000": small_scale,
    "Chora 1:5.000": large_scale,
    "Land uses": landuses,
    "Annotations": annot,  
};

L.control.layers(baseMaps,overlays).addTo(map);

// Group the basemap radio buttons semantically
document.querySelectorAll(".leaflet-control-layers-base").forEach(function(group) {
  if (group.querySelector("fieldset")) return;

  const fieldset = document.createElement("fieldset");
  fieldset.className = "accessible-basemap-fieldset";

  const legend = document.createElement("legend");
  legend.textContent = "Base map selection";
  legend.className = "visually-hidden";

  fieldset.appendChild(legend);

  while (group.firstChild) {
    fieldset.appendChild(group.firstChild);
  }

  group.appendChild(fieldset);
});

// Όταν ενεργοποιείται το layer, κάνε zoom στο bounding box
map.on('overlayadd', function(e) {
  if (e.layer === large_scale) {
    map.fitBounds(bbox);
  }
});



//Graphic Scale
var graphicScale1 = L.control.graphicScale({
	doubleLine: false,
	fill: 'fill',
    showSubunits: false
	}).addTo(map);  
	
// Cursor Coordinates
L.control.coordinates({
    position: "bottomright",
    decimals: 4,
    decimalSeperator: ".",
    labelTemplateLat: "Latitude: {y}",
    labelTemplateLng: "Longitude: {x}"
}).addTo(map);

// Accessible labels for the coordinate input fields
document.querySelectorAll(
  ".leaflet-control-coordinates .inputX"
).forEach(function(input) {
  input.setAttribute("aria-label", "Longitude");
});

document.querySelectorAll(
  ".leaflet-control-coordinates .inputY"
).forEach(function(input) {
  input.setAttribute("aria-label", "Latitude");
});


//a window appears when the user clicks the map
//map.on('click', function(){alert("You clicked the map");}); 



// -------------------------------------------------------------------------
// Accessibility: strengthen ARIA labels on Leaflet controls.
// Leaflet gives generic titles; here we add explicit aria-labels so screen
// readers announce meaningful names in any language setting.
// -------------------------------------------------------------------------
setTimeout(function () {
  // Zoom in/out
  var zin  = document.querySelector('.leaflet-control-zoom-in');
  var zout = document.querySelector('.leaflet-control-zoom-out');
  if (zin)  { zin.setAttribute('aria-label',  'Zoom in on the map'); }
  if (zout) { zout.setAttribute('aria-label', 'Zoom out of the map'); }

  // Layers toggle (top-right)
  var layersToggle = document.querySelector('.leaflet-control-layers-toggle');
  if (layersToggle) {
    layersToggle.setAttribute('aria-label', 'Map layers. Press Enter to open the layer selection panel.');
    layersToggle.setAttribute('role', 'button');
    layersToggle.setAttribute('tabindex', '0');
  }

  // The expanded layers list is a group of radio buttons + checkboxes
  var layersControl = document.querySelector('.leaflet-control-layers');
  if (layersControl) {
    layersControl.setAttribute('role', 'group');
    layersControl.setAttribute('aria-label', 'Map layers');
  }

  // Minimap toggle
  var miniToggle = document.querySelector('.leaflet-control-minimap-toggle-display');
  if (miniToggle) {
    miniToggle.setAttribute('aria-label', 'Toggle the overview minimap');
  }

  // The Attribution area
  var attr = document.querySelector('.leaflet-control-attribution');
  if (attr) {
    attr.setAttribute('aria-label', 'Map attribution and data sources');
  }
}, 500);

}