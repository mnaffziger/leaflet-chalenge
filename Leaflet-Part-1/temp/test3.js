let map = createMap();

    let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    d3.json(url).then(function(data) {
      function createMarkers(map, response) {
        // This function determines the color of the marker based on the depth of the earthquake.
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

        // This function determines the radius of the earthquake marker based on its magnitude.
        function getRadius(magnitude) {
          if (magnitude === 0) {
            return 1;
          }
          return magnitude * 4;
        }

        // Here we create a GeoJSON layer with the data and style it using the styleInfo function.
        let geoJsonLayer = L.gridLayer.repeatedMarkers({
          maxZoom: 18,
        });

        data.features.forEach(function(feature) {
          let depth = feature.geometry.coordinates[2];
          let magnitude = feature.properties.mag;

          let markerOptions = {
            icon: L.divIcon({
              className: "custom-circle-marker",
              iconSize: getRadius(magnitude) * 2, // The custom size based on magnitude
              html: `<div style="background-color: ${getColor(
                depth
              )}; width: ${
                getRadius(magnitude) * 2
              }px; height: ${
                getRadius(magnitude) * 2
              }px; border-radius: 50%;"></div>`,
            }),
          };

          let marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], markerOptions);
          marker.bindPopup(
            "Magnitude: " +
              feature.properties.mag +
              "<br>Depth: " +
              feature.geometry.coordinates[2] +
              "<br>Location: " +
              feature.properties.place
          );
          geoJsonLayer.addMarker(marker);
        });

        // Add the GeoJSON layer to the map
        geoJsonLayer.addTo(map);
      }

      createMarkers(map, data);

      // Here we create a custom legend control object.
      let legend = L.control({
        position: "bottomright",
      });

      // Then add all the details for the legend
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");

        let grades = [10, 30, 50, 70, 90];
        let colors = ["#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"].reverse();

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
            "<i style='background: " +
            colors[i] +
            "'></i> " +
            grades[i] +
            (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };

      // Finally, add the legend to the map.
      legend.addTo(map);
    });

    function createMap() {
      let map = L.map("map").setView([37.09, -95.71], 4);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      return map;
    }