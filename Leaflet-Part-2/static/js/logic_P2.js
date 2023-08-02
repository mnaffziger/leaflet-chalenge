let map = createMap();

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Fetch tectonic plates data
fetch(tectonicPlatesUrl)
  .then(response => response.json())
  .then(tectonicPlatesData => {
    // Create the Tectonic Plates overlay layer
    let tectonicPlatesOverlay = L.geoJSON(tectonicPlatesData, {
      style: {
        color: "#ff0000", // Red color for the tectonic plates
        weight: 2, // Line weight
        opacity: 0.7, // Opacity
      },
      // Add popup for each feature (tectonic plate)
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.Name) {
          layer.bindPopup("Plate Name: " + feature.properties.Name);
        }
      },
    });

    // Add the Tectonic Plates overlay to the map
    tectonicPlatesOverlay.addTo(map);

    d3.json(url).then(function (data) {
      // Define the color of the markers
      function getColor(depth) {
        switch (true) {
          case depth > 90:
            return "#ea2c2c";
          case depth > 70:
            return "#ea822c";
          case depth > 50:
            return "#ee9c00";
          case depth > 30:
            return "#eecc00";
          case depth > 10:
            return "#d4ee00";
          default:
            return "#98ee00";
        }
      }
      
      // Define how large the marker is based on the magnitude of the earthquake
      function getSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
        let fixedZoomLevel = 4;
        let scaleFactor = 5;
        return magnitude * scaleFactor * (map.getZoom() / fixedZoomLevel);
      }

      // Call Leaflet plugin RepeatedMarkers to create a layer for the earthquake markers
      let repeatedMarkers = L.gridLayer.repeatedMarkers().addTo(map);

      data.features.forEach(function (feature) {
        // Extract relevant data from the feature
        let depth = feature.geometry.coordinates[2];
        let magnitude = feature.properties.mag;
        let lat = feature.geometry.coordinates[1];
        let lng = feature.geometry.coordinates[0];

        // Define the marker's appearance based on depth and magnitude
        let circleOptions = {
          fillColor: getColor(depth),
          color: "#000000",
          fillOpacity: 0.5,
          radius: getSize(magnitude),
          stroke: true,
          weight: 1,
        };

        // Create a customized marker using L.divIcon
        let marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: "epicenter",
            html: `<div style="background-color: ${circleOptions.fillColor}; 
                width: ${circleOptions.radius}px; 
                height: ${circleOptions.radius}px; 
                border-radius: 50%;
                border: 1px solid black; 
                opacity: 0.6;"></div>`,
            iconSize: [circleOptions.radius, circleOptions.radius],
          }),
        });

        // Add a popup with earthquake information to the marker
        marker.bindPopup(
          "<h4>Date: " + new Date(feature.properties.time) +
          "</h4>Magnitude: " + magnitude +
          "<br>Depth: " + depth +
          "<br><br>Location: " + feature.properties.place
        );

        // Add the marker to the RepeatedMarkers layer
        repeatedMarkers.addMarker(marker);
      });

      // Create an overlay map object to hold the "Tectonic Plates" layer and "Earthquake Markers" layer
      let overlayMaps = {
        "Tectonic Plates": tectonicPlatesOverlay,
        "Earthquake Markers": repeatedMarkers,
      };

      // Add both layers to the map
      tectonicPlatesOverlay.addTo(map);
      repeatedMarkers.addTo(map);

      // Add the "Tectonic Plates" and "Earthquake Markers" overlay to the layer control with default checked status
      L.control.layers(null, overlayMaps, {
        collapsed: false,
      }).addTo(map);
    });
  });

function createMap() {
  // Create tile layer for the background map
  let Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  });

  let USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
  });

  // Create baseMaps object to hold the streetmap layer
  let baseMaps = {
    "Simple": Stadia_AlidadeSmooth,
    "Topographic": USGS_USImageryTopo
  };

  // Create map object with options
  let map = L.map("map", {
    center: [45.5, -120], // on Oregon, USA
    zoom: 5.5,
    zoomSnap: 0.5,
    layers: [Stadia_AlidadeSmooth]
  });

  // Create an overlay map object to hold the epicenter layer
  let overlayMaps = {
    // "Tectonic Plates": tectonicPlatesOverlay
  };

  // Create layer control and pass baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  L.control.scale().addTo(map); // From Leaflet docs

  return map;
}