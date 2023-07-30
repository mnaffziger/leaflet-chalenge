
let map = createMap();

    let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    d3.json(url).then(function (data) {
        // Define the color of the markers
        // The switch statement is new to me, so I had to learn about it: https://www.w3schools.com/js/js_switch.asp
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
      // Call Leaflet plugin RepeatedMarkers so that markers on either side of the International Dateline
      // are viewed at the same time.  Tried the worldCopyJump and boundry map conditions, and they 
      // did not provide a good user experiance
      let repeatedMarkers = L.gridLayer.repeatedMarkers().addTo(map);

      data.features.forEach(function (feature) {
        let depth = feature.geometry.coordinates[2];
        let magnitude = feature.properties.mag;
        let lat = feature.geometry.coordinates[1];
        let lng = feature.geometry.coordinates[0];

        // Artifact from Leaflet's circleMarker method.  Code block elements are recycled within the 
        // L.marker-html block
        let circleOptions = {
          fillColor: getColor(depth),
          color: "#000000",
          fillOpacity: 0.5,
          radius: getSize(magnitude),
          stroke: true,
          weight: 1,
        };
        // Leaflet plugin RepeatedMarkers does not support Leaflet's circleMarker method.  
        // Needed to create marker layer using a customized html script
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
          })
        });

        marker.bindPopup(
            "<h4>Date: " + new Date(feature.properties.time) +
            "</h4>Magnitude: " + magnitude +
            "<br>Depth: " + depth +
            "<br><br>Location: " + feature.properties.place
        );

    
        repeatedMarkers.addMarker(marker);
      });

      // Custom legend control object.
      // Legend code referenced from https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
    
      let legend = L.control({
        position: "bottomright"
    });

    // Then add all the details for the legend
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "legend");
        let labels = [-10, 10, 30, 50, 70, 90];
        let colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
        div.innerHTML += "<h4>Quake Depth</h4><h5>Depths ranges<br>are below sea level</h5>";
        for (let i = 0; i < labels.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                (i === labels.length - 1 ? 'Over ' : '') +
                labels[i] + (labels[i + 1] ? ' &ndash; ' + labels[i + 1] + ' km<br>' : ' km');
        }
        // div.innerHTML += "Below 90km";
        return div;
    };

    legend.addTo(map);
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
        }); //https://leaflet-extras.github.io/leaflet-providers/preview/
    
        // Create baseMaps object to hold the streetmap layer
        let baseMaps = {
            "Simple" : Stadia_AlidadeSmooth,
            "Topographic" : USGS_USImageryTopo
        };
    
        // Create map object with options
        let map = L.map("map", {
            // center: [30, -160], // Pacific rim
            center: [45.5, -120], // on Oregon, USA
            zoom: 5.5,
            zoomSnap: 0.5,
            layers: [Stadia_AlidadeSmooth]
        });
    
        // Create an overlay map object to hold the epicenter layer
        let overlayMaps = {};
    
        // Create layer control and pass baseMaps and overlayMaps
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(map);
    
        L.control.scale().addTo(map); // From Leaflet docs
    
        return map;
    }