function createMap(earthquakes) {

    // Create tile layer for the background map
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create baseMaps object to hold the streetmap later
    let baseMaps = {
        "Street Map" : streetmap
    };

    // Create map object with options
    let map = L.map("map", {
        // center: [45.5, -120], // on Oregon, USA
        center: [0,0],
        zoom: 1,
        layers: [streetmap]
    });

     // Create an overlay map object to hold epicenter layer
    let overlayMaps = {
        "Epicenters" : earthquakes
    };

    // Create layer control, pass baseMaps and 
    L.control.layers(baseMaps,overlayMaps,{
        collapsed: false
    }).addTo(map);
}


function createMarkers(response){

    // pull "feature" property from responce.features"
    let quakes = response.features;

    // Initialize an array to hold earthquakes recorded
    let earthquakes = [];

    console.log(quakes);


    // loop through the "features" array to populate earthquake array
    for (let index = 0; index < quakes.length; index++) {
        let earthquake = quakes[index];

        console.log(earthquake);

        // for each recorded earthquake, create a marker, and bind a popup with the some info
        let quakeMarker = L.marker([earthquake.geometry.coordinates[1],earthquake.geometry.coordinates[0]])
            .bindPopup("<h3>" + earthquake.properties.place + "</h3><h3> Date: " + new Date(earthquake.properties.time) + "</h3><h3> Magnitude: " + earthquake.properties.mag + "</h3>");

        // add marker to the quake markers array
        earthquakes.push(quakeMarker);
    }

    // create a layer frou that's made from the quake markers array and pass to the create map function
    createMap(L.layerGroup(earthquakes));
}


// Perform API call, call createMarkers when complete

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(createMarkers);