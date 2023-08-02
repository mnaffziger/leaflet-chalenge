# leaflet-challenge
Module 15 Challenge: Map Visualization with Leaflet

### Notes
* Within the Leaflet-Part-1 and Leaflet-Part-2 directories are separate html, js, and css files for the 2 parts of the challenge assignment. 
* Sourse material was pulled from the USGS website for 'All Earthquakes from the Past 7 Days"



### Leaflet Plugins
Due to how the Leaflet base map is constructed the longitude continues past +/- 180 degrees.  Normally this artifact would be OK since the maps are typically focused to a small geographic area.  However, in this challenge I am pullilng global data on earthquake epicenters.  For all data circling the International Dateline, the original data is either placed on the east coast of Asia, or on the west of the Americas. Unfortunently, this means that data around the Pacific Ocean can never been observed at the same time.  Leaflet does provide on board fixes such as setting map boundries, or worldCopyJump, but none of these solutions are acceptable for the end user.  

Geologically, the Pacific Ocean contain some of the most active geological features.  Considering the fact, each land mass surrounding the ocean contains a volcano, it is often referred to as the Pacific Ring of Fire.  Considering its considerable seismic activity, it is important for users/researchers to be able to view the entire dataset surrounding the Pacific Ocean.  To solve this problem, I used a Leaflet Plugin called RepeatedMarkers (https://gitlab.com/IvanSanchez/Leaflet.RepeatedMarkers).  This plugin mearly repeates each marker in the dataset every 360 degrees from the original coordinates.  There were some additional hurdles, i.e.Leaflet's circle.Marker method does not work within RepeatedMarkers, so I had to write addition code to create the desired circle marker.

### References and Additional Help
* Source data: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
* Legend creation: https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
* Switch javascript statement: https://www.w3schools.com/js/js_switch.asp
* Additional Leaflet maps: https://leaflet-extras.github.io/leaflet-providers/preview/
* Auto range map scale: https://leafletjs.com/examples/zoom-levels/
* Tectonic plate source map data: https://github.com/fraxen/tectonicplates
